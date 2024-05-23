

//function to calculate compound interest given, principle, rate, years, and #compounds per year.
export function calculateCompoundInterest(investmentAmount: number, interestRate: number, duration: number, compoundsPerYear: number): string {
    const rate = interestRate / 100;
    const amount = investmentAmount * Math.pow((1 + rate / compoundsPerYear), compoundsPerYear * duration);
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
// method to remove the '%' character from the rate.
export function parsePercentage(percentageString: string): number {
    const numericString = percentageString.replace('%', '');
    const numericValue = parseFloat(numericString);
    return numericValue;
}
