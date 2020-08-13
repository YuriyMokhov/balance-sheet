export interface BalanceElement {
    name: string;
    assets?: BalanceElement[],
    liabilities?: BalanceElement[]
}
