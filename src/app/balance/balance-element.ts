
export interface BalanceElement {
    name: string,
    id: string,
    assets: BalanceElementAsset[],
    liabilities: BalanceElementLiabilities[]

}

export interface BalanceElementAsset {
    name: string,
    value: number,
    color: string
}

export interface BalanceElementLiabilities {
    name: string,
    value: number,
    color: string
}

