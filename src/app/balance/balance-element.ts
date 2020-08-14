export interface BalanceElement {
    name: string;
    assets: BalanceElementAsset[],
    liabilities: BalanceElementLiabilities[]
}

export interface BalanceElementAsset {
    name: string;
    value: number
}

export interface BalanceElementLiabilities {
    name: string;
    value: number
}

