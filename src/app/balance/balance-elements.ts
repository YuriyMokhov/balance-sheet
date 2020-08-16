import { BalanceElement } from './balance-element';

export class BalanceElements {
    public Treasury: BalanceElement;
    public CentralBank: BalanceElement;
    public Banks: BalanceElement;
    public Households: BalanceElement;
    public Companies: BalanceElement;
    public FederalGovernmentSectorAggregate: BalanceElement;
    public PrivateSectorAggregate: BalanceElement;
    public TotalEconomy: BalanceElement;

    constructor() {
        this.reset1stLevel();
        this.calculate1stLevel();
        this.reset2ndLevel();
        this.calculate2ndLevel();
        this.reset3thLevel();
        this.calculate3thLevel();

    }
    get1stLevelElements(): BalanceElement[] {
        return [this.Banks, this.Households, this.Companies];
    }
    reset1stLevel() {
        //1st level
        this.Treasury = {
            name: 'Treasury (Federal Government)',

            assets: [
                {
                    name: 'Neg.Equity',
                    value: null,
                    color: '#00303F'
                },
                { name: 'T.Deposits', value: 40, color: '#7A9D96' }],
            liabilities: [{
                name: 'Treasuries',
                value: null,
                color: '#DCAE1D'
            }]
        }
        this.CentralBank = {
            name: 'Central Bank (Federal Government)',
            assets: [{
                name: 'Treasuries',
                value: null,
                color: '#7A9D96'
            }],
            liabilities: [
                { name: 'Equity', value: 10, color: '#00303F' },
                {
                    name: 'Currency',
                    value: null,
                    color: '#DCAE1D'
                }, {
                    name: 'Deposits',
                    value: null,
                    color: '#DCAE1D'
                }]
        }
        this.Banks = {
            name: 'Banks',
            assets: [{ name: 'Currency', value: 40, color: '#7A9D96' }, { name: 'Reserves', value: 80, color: '#7A9D96' }],
            liabilities: [
                {
                    name: 'Equity',
                    value: null,
                    color: '#00303F'
                },
                {
                    name: 'Deposits',
                    value: null,
                    color: '#DCAE1D'
                }]
        }
        this.Households = {
            name: 'Households',
            assets: [{ name: 'Currency', value: 0, color: '#7A9D96' },
            { name: 'Deposits', value: 40, color: '#7A9D96' },
            { name: 'Treasuries', value: 40, color: '#7A9D96' }],
            liabilities: [
                {
                    name: 'Equity',
                    value: null,
                    color: '#00303F'
                }]
        }
        this.Companies = {
            name: 'Companies',
            assets: [{ name: 'Deposits', value: 40, color: '#7A9D96' }],
            liabilities: [{ name: 'Equity', value: null, color: '#00303F' }]
        }
    }

    calculate1stLevel() {
        this.Treasury.assets.find(x => x.name == 'Neg.Equity').value =
            this.CentralBank.liabilities.find(x => x.name == 'Equity').value
            + this.Banks.assets.find(x => x.name == 'Currency').value
            + this.Households.assets.find(x => x.name == 'Currency').value
            + this.Banks.assets.find(x => x.name == 'Reserves').value
            + this.Households.assets.find(x => x.name == 'Treasuries').value;
        console.log(`Neg.Equity Treasury: ${this.Treasury.assets.find(x => x.name == 'Neg.Equity').value}`);

        this.Treasury.liabilities.find(x => x.name == 'Treasuries').value =
            this.Treasury.assets.find(x => x.name == 'Neg.Equity').value
            + this.Treasury.assets.find(x => x.name == 'T.Deposits').value;
        console.log(`Treasuries Treasury: ${this.Treasury.liabilities.find(x => x.name == 'Treasuries').value}`);


        this.CentralBank.liabilities.find(x => x.name == 'Currency').value =
            this.Banks.assets.find(x => x.name == 'Currency').value
            + this.Households.assets.find(x => x.name == 'Currency').value;
        console.log(`Currency CentralBank: ${this.CentralBank.liabilities.find(x => x.name == 'Currency').value}`);

        this.CentralBank.liabilities.find(x => x.name == 'Deposits').value =
            this.Treasury.assets.find(x => x.name == 'T.Deposits').value
            + this.Banks.assets.find(x => x.name == 'Reserves').value;
        console.log(`Deposits CentralBank: ${this.CentralBank.liabilities.find(x => x.name == 'Deposits').value}`);

        this.CentralBank.assets.find(x => x.name == 'Treasuries').value =
            this.CentralBank.liabilities.find(x => x.name == 'Equity').value
            + this.CentralBank.liabilities.find(x => x.name == 'Currency').value
            + this.CentralBank.liabilities.find(x => x.name == 'Deposits').value;
        console.log(`Treasuries CentralBank: ${this.CentralBank.assets.find(x => x.name == 'Treasuries').value}`);

        this.Banks.liabilities.find(x => x.name == 'Deposits').value =
            this.Households.assets.find(x => x.name == 'Deposits').value
            + this.Companies.assets.find(x => x.name == 'Deposits').value;

        this.Banks.liabilities.find(x => x.name == 'Equity').value =
            this.Banks.assets.find(x => x.name == 'Reserves').value
            + this.Banks.assets.find(x => x.name == 'Currency').value
            - this.Banks.liabilities.find(x => x.name == 'Deposits').value;

        this.Households.liabilities.find(x => x.name == 'Equity').value =
            this.Households.assets.find(x => x.name == 'Treasuries').value
            + this.Households.assets.find(x => x.name == 'Deposits').value
            + this.Households.assets.find(x => x.name == 'Currency').value;

        this.Companies.liabilities.find(x => x.name == 'Equity').value =
            this.Companies.assets.find(x => x.name == 'Deposits').value;
    }

    get2ndLevelElements(): BalanceElement[] {
        return [this.FederalGovernmentSectorAggregate, this.PrivateSectorAggregate];
    }
    reset2ndLevel() {
        this.FederalGovernmentSectorAggregate = {
            name: 'Federal Government (aggregate)',
            assets: [
                {
                    name: 'Neg.Equity',
                    color: '#00303F',
                    value: null
                },
                {
                    name: 'Assets',
                    color: '#7A9D96',
                    value: null
                }
            ],
            liabilities: [{
                name: 'Liabilities',
                color: '#DCAE1D',
                value: null
            }]
        };

        this.PrivateSectorAggregate = {
            name: 'Private Sector (aggregate)',
            assets: [
                {
                    name: 'Assets',
                    color: '#7A9D96',
                    value: null
                }
            ],
            liabilities: [
                {
                    name: 'Equity',
                    color: '#00303F',
                    value: null
                }, {
                    name: 'Liabilities',
                    color: '#DCAE1D',
                    value: null
                }]
        };

    }

    calculate2ndLevel() {
        //         Federal Government Sector (aggregate)
        // Neg.Equity = Neg.Equity (Treasury) - Equity (Central Bank)
        // Assets = T.Deposits (Treasury) + Treasuries (Central Bank)
        // Liabilities = Treasuries (Treasury) + Deposits (Central Bank) + Currency (Central Bank)


        this.FederalGovernmentSectorAggregate.assets.find(x => x.name == 'Neg.Equity').value =
            this.Treasury.assets.find(x => x.name == 'Neg.Equity').value
            - this.CentralBank.liabilities.find(x => x.name == 'Equity').value;
        console.log(`Neg.Equity FederalGovernmentSectorAggregate: ${this.FederalGovernmentSectorAggregate.assets.find(x => x.name == 'Neg.Equity').value}`);

        this.FederalGovernmentSectorAggregate.assets.find(x => x.name == 'Assets').value =
            this.Treasury.assets.find(x => x.name == 'T.Deposits').value
            + this.CentralBank.assets.find(x => x.name == 'Treasuries').value;
        console.log(`Assets FederalGovernmentSectorAggregate: ${this.FederalGovernmentSectorAggregate.assets.find(x => x.name == 'Assets').value}`);

        this.FederalGovernmentSectorAggregate.liabilities.find(x => x.name == 'Liabilities').value =
            this.Treasury.liabilities.find(x => x.name == 'Treasuries').value
            + this.CentralBank.liabilities.find(x => x.name == 'Deposits').value
            + this.CentralBank.liabilities.find(x => x.name == 'Currency').value;
        console.log(`Liabilities FederalGovernmentSectorAggregate: ${this.FederalGovernmentSectorAggregate.liabilities.find(x => x.name == 'Liabilities').value}`);

        //             Private Sector (aggregate)
        // Assets = Currency (Banks) + Reserves (Banks) + Treasuries (Households) + Deposits (Households) + Deposits (Companies)
        // Equity = Equity (Banks) + Equity (Households) + Equity (Companies)
        // Liabilities = Deposits (Banks)


        this.PrivateSectorAggregate.assets.find(x => x.name == 'Assets').value =
            this.Banks.assets.find(x => x.name == 'Currency').value
            + this.Banks.assets.find(x => x.name == 'Reserves').value
            + this.Households.assets.find(x => x.name == 'Treasuries').value
            + this.Households.assets.find(x => x.name == 'Deposits').value
            + this.Companies.assets.find(x => x.name == 'Deposits').value;
        console.log(`Assets PrivateSectorAggregate: ${this.PrivateSectorAggregate.assets.find(x => x.name == 'Assets').value}`);


        this.PrivateSectorAggregate.liabilities.find(x => x.name == 'Equity').value =
            this.Banks.liabilities.find(x => x.name == 'Equity').value
            + this.Households.liabilities.find(x => x.name == 'Equity').value
            + this.Companies.liabilities.find(x => x.name == 'Equity').value;
        console.log(`Equity PrivateSectorAggregate: ${this.PrivateSectorAggregate.liabilities.find(x => x.name == 'Equity').value}`);

        this.PrivateSectorAggregate.liabilities.find(x => x.name == 'Liabilities').value =
            this.Banks.liabilities.find(x => x.name == 'Deposits').value;
        console.log(`Liabilities PrivateSectorAggregate: ${this.PrivateSectorAggregate.liabilities.find(x => x.name == 'Liabilities').value}`);

    }

    get3thLevelElements(): BalanceElement[] {
        return [this.TotalEconomy];
    }

    reset3thLevel() {
        this.TotalEconomy = {
            name: 'Total Economy (aggregate)',
            assets: [
                {
                    name: 'Assets',
                    color: '#7A9D96',
                    value: null
                }
            ],
            liabilities: [{
                name: 'Liabilities',
                color: '#DCAE1D',
                value: null
            }]
        };

    }

    calculate3thLevel() {

        //Total Economy (aggregate)
        // Assets = Assets (Federal Government Sector) + Assets (Private Sector)
        // Liabilities = Liabilities (Federal Government Sector) + Liabilities (Private Sector)

        this.TotalEconomy.assets.find(x => x.name == 'Assets').value =
            this.FederalGovernmentSectorAggregate.assets.find(x => x.name == 'Assets').value
            + this.PrivateSectorAggregate.assets.find(x => x.name == 'Assets').value;
        console.log(`Assets TotalEconomy: ${this.TotalEconomy.assets.find(x => x.name == 'Assets').value}`);


        this.TotalEconomy.liabilities.find(x => x.name == 'Liabilities').value =
            this.FederalGovernmentSectorAggregate.liabilities.find(x => x.name == 'Liabilities').value
            + this.PrivateSectorAggregate.liabilities.find(x => x.name == 'Liabilities').value;
        console.log(`Liabilities PrivateSectorAggregate: ${this.TotalEconomy.liabilities.find(x => x.name == 'Liabilities').value}`);


    }


}
