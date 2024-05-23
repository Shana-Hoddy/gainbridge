import { test, expect } from '@playwright/test';
import {SPGCalculatorPage, YearsMapping} from "../pageobjects/SPGCalculatorPage";
import * as fs from 'fs';
import * as path from 'path';
import  {parse}  from 'csv-parse/sync';
import {calculateCompoundInterest, parsePercentage} from "../utilities/calculations";



test.describe('Investment Amount Field Validations', () => {

    const values = ["1000", "50000", "1000000"];
    for(const v of values) {
        test(`Test valid amount ${v} triggers projected valuation calculation`, async ({page}) => {
            const spgPage = new SPGCalculatorPage(page);
            await spgPage.goto();
            await spgPage.setInvestmentAmount(v);
            let val = await spgPage.getProjectedAccountValue();
            expect(val).not.toEqual("");
        });
    }

    const invalidValues = ["999", "abc", "1000001", "-1"];
    for(const v of invalidValues) {
        test(`Test invalid amount ${v} does NOT trigger projected valuation calculation`, async ({page}) => {
            const spgPage = new SPGCalculatorPage(page);
            await spgPage.goto();
            await spgPage.setInvestmentAmount(v);
            let val = await spgPage.getProjectedAccountValue();
            //invalid values will not be permitted to be "set" so the input field will remain = $
            expect(val).toEqual("$");
        });
    }
});

/**
 * Note these values shouldn't be hard-coded into the tests and should be stored elsewhere
 * such as a properties or constants file. For the sake of time I'm just directly using them here
 */
test.describe('Interest Rate matches Investment duration', () => {
    test("verify 3 years = 6% rate", async ({page }) => {
        const spgPage = new SPGCalculatorPage(page);
        await spgPage.goto();
        await spgPage.setInvestmentDuration(YearsMapping["3 years"]);
        let rate = await spgPage.getInterestRate();
        expect(rate).toEqual("6%");
    });

    test("verify 4 years = 6.1% rate", async ({page }) => {
        const spgPage = new SPGCalculatorPage(page);
        await spgPage.goto();
        await spgPage.setInvestmentDuration(YearsMapping["4 years"]);
        let rate = await spgPage.getInterestRate();
        expect(rate).toEqual("6.1%");
    });

    const years = [YearsMapping["5 years"], YearsMapping["6 years"],YearsMapping["7 years"],
        YearsMapping["8 years"],YearsMapping["9 years"],YearsMapping["10 years"]];
    for(const y of years) {
        test(`verify years 5-10 = 6.15% rate, testing year ${y}`, async ({page}) => {
            const spgPage = new SPGCalculatorPage(page);
            await spgPage.goto();
            await spgPage.setInvestmentDuration(y);
            let rate = await spgPage.getInterestRate();
            expect(rate).toEqual("6.15%");
        });
    }
});

/**
 * Tests to verify that the investment, duration & rate are calculated correctly.
 * I'd need to know the formulas used to determine the expected results, such as how often
 * the interest compounds.
 *
 */

const testData = parse(fs.readFileSync(path.join(process.cwd(), "./data/steadyPaceGrowthCalcData.csv")), {
    columns: true,
    skip_empty_lines: true
})
test.describe('Projected account value calculation tests', () => {
    for(const data of testData) {
        test(`Test calculations for ${data.test_case}`, async ({page}) => {
            console.log(data.investment_amount, data.duration, data.projected_value);
            const spgPage = new SPGCalculatorPage(page);
            await spgPage.goto();
            await spgPage.setInvestmentAmount(data.investment_amount);
            await spgPage.setInvestmentDuration(YearsMapping[data.duration + " years"]);
            let rate = await spgPage.getInterestRate();
            let result = calculateCompoundInterest(data.investment_amount, parsePercentage(rate), data.duration, 1);
            expect(result).toEqual(data.projected_value);
        });
    }
});


