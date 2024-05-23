import { Locator, Page } from "@playwright/test";
/**
 * Page object for the SteadyPage Growth Calculator page.
 */


/**
 * used to translate investment duration years to coordinates.
 * This may not work for resized windows so doing the calculation based on a percentage
 * would likely be more stable, but for lack of time I'm using set pixel locations.
 */
export enum YearsMapping {
    "3 years" = 0,
    "4 years" = 50,
    "5 years" = 100,
    "6 years" = 200,
    "7 years" = 250,
    "8 years" = 300,
    "9 years" = 350,
    "10 years" = 400,
}

export class SPGCalculatorPage {

    /**
     * Ideally URLs wouldn't be hard-coded here. We may be testing multiple environments and
     * would use environment varaibles to determine the baseURL, but for sake of time placing this here.
     */
    private readonly URL: string = "https://enrollment-2.gainbridge.io/product-selection/steadypace";


    page: Page;
    investmentAmount: Locator;
    interestRate: Locator;
    investmentDuration: Locator;
    projectedAcctVal: Locator;
    purchaseSPButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.investmentAmount = page.getByTestId("investment-amount");
        this.interestRate = page.getByTestId("interest-rate");
        this.investmentDuration = page.getByTestId("investment-duration");
        this.projectedAcctVal = page.getByTestId("projected-value");
        this.purchaseSPButton = page.getByTestId("purchase-button");
    }

    async goto() {
        await this.page.goto(this.URL);
    }

    /**
     * this.investmentAmount.fill did not work, I needed to use page.keyboard.type followed by
     * waitFor() and THEN press enter.
     * @param value
     */
    async setInvestmentAmount(value: string) {
        await this.investmentAmount.waitFor();
        await this.investmentAmount.focus();
        await this.page.keyboard.type(value);

        // Ensure the value is typed before proceeding
        await this.page.waitForTimeout(100);
        await this.page.keyboard.press('Enter');

        // wait for input field to be loaded
        await this.page.waitForTimeout(100);
        await this.investmentAmount.waitFor();
    }

    async getInvestmentAmount(): Promise<string | null> {
        return await this.investmentAmount.getAttribute("value");
    }
    async getInterestRate(): Promise<string | null> {
        return await this.interestRate.getAttribute("value");
    }

    async setInvestmentDuration(year: YearsMapping){
        //standard waitFor locators were inconsistent so am using promise resolves
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.investmentDuration.click({
            position: { x:year, y: 0},
        });
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    async getProjectedAccountValue(): Promise<string | null>{
        if (this.projectedAcctVal) {
            return await this.projectedAcctVal.textContent();
        }
        return null;
    }

    async clickPurchaseSteadyPageButton(){
        await this.purchaseSPButton.click();
    }
}