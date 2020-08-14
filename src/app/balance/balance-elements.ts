import { BalanceElement } from './balance-element';

export class BalanceElements {
    public Treasury: BalanceElement;
    public CentralBank: BalanceElement;
    public Banks: BalanceElement;
    public Households: BalanceElement;
    public Companies: BalanceElement;

    constructor() {


        this.Treasury = {
            name: 'Treasury (Federal Government)',
            assets: [
                {
                    name: 'Neg.Equity',
                    value: null
                },
                { name: 'T.Deposits', value: 40 }],
            liabilities: [{
                name: 'Treasuries',
                value: null
            }]
        }
        this.CentralBank = {
            name: 'Central Bank (Federal Government)',
            assets: [{
                name: 'Treasuries',
                value: null
            }],
            liabilities: [
                { name: 'Equity', value: 10 },
                {
                    name: 'Currency',
                    value: null
                }, {
                    name: 'Deposits',
                    value: null
                }]
        }
        this.Banks = {
            name: 'Banks',
            assets: [{ name: 'Currancy', value: 40 }, { name: 'Reserves', value: 80 }],
            liabilities: [
                {
                    name: 'Equity',
                    value: null
                },
                {
                    name: 'Deposits',
                    value: null
                }]
        }
        this.Households = {
            name: 'Households',
            assets: [{ name: 'Currancy', value: 0 }, { name: 'Deposits', value: 40 }, { name: 'Treasuries', value: 40 }],
            liabilities: [
                {
                    name: 'Equity',
                    value: null
                }]
        }
        this.Companies = {
            name: 'Companies',
            assets: [{ name: 'Deposits', value: 40 }],
            liabilities: [{ name: 'Equity', value: null }]
        }

        //////////////////////////
        this.Treasury.assets.find(x => x.name == 'Neg.Equity').value =
            this.CentralBank.liabilities.find(x => x.name == 'Equity').value
            + this.Banks.assets.find(x => x.name == 'Currancy').value
            + this.Households.assets.find(x => x.name == 'Currancy').value
            + this.Banks.assets.find(x => x.name == 'Reserves').value
            + this.Households.assets.find(x => x.name == 'Treasuries').value;
        console.log(`Neg.Equity Treasury: ${this.Treasury.assets.find(x => x.name == 'Neg.Equity').value}`);

        this.Treasury.liabilities.find(x => x.name == 'Treasuries').value =
            this.Treasury.assets.find(x => x.name == 'Neg.Equity').value
            + this.Treasury.assets.find(x => x.name == 'T.Deposits').value;
        console.log(`Treasuries Treasury: ${this.Treasury.liabilities.find(x => x.name == 'Treasuries').value}`);


        this.CentralBank.liabilities.find(x => x.name == 'Currency').value =
            this.Banks.assets.find(x => x.name == 'Currancy').value
            + this.Households.assets.find(x => x.name == 'Currancy').value;
        console.log(`Currency CentralBank: ${this.CentralBank.liabilities.find(x => x.name == 'Currency').value}`);

        this.CentralBank.liabilities.find(x => x.name == 'Deposits').value =
            this.Treasury.assets.find(x => x.name == 'T.Deposits').value
            + this.Banks.assets.find(x => x.name == 'Reserves').value;
        console.log(`Deposits CentralBank: ${this.CentralBank.liabilities.find(x => x.name == 'Deposits').value}`);

        this.CentralBank.assets.find(x => x.name == 'Treasuries').value =
            this.CentralBank.liabilities.find(x => x.name == 'Equity').value
            + this.CentralBank.liabilities.find(x => x.name == 'Currancy').value
            + this.CentralBank.liabilities.find(x => x.name == 'Deposits').value;
        console.log(`Treasuries CentralBank: ${this.CentralBank.liabilities.find(x => x.name == 'Treasuries').value}`);

        this.Banks.liabilities.find(x => x.name == 'Deposits').value =
            this.Households.assets.find(x => x.name == 'Deposits').value
            + this.Companies.assets.find(x => x.name == 'Deposits').value;

        this.Banks.liabilities.find(x => x.name == 'Equity').value =
            this.Banks.assets.find(x => x.name == 'Reserves').value
            + this.Banks.assets.find(x => x.name == 'Currancy').value
            - this.Banks.liabilities.find(x => x.name == 'Deposits').value;

        this.Households.liabilities.find(x => x.name == 'Equity').value =
            this.Households.assets.find(x => x.name == 'Treasuries').value
            + this.Households.assets.find(x => x.name == 'Deposits').value
            + this.Households.assets.find(x => x.name == 'Currancy').value;

        this.Companies.liabilities.find(x => x.name == 'Equity').value =
            this.Companies.assets.find(x => x.name == 'Deposits').value;


        // this.Treasury = {
        //     name: 'Treasury (Federal Government)',
        //     assets: [
        //         {
        //             name: 'Neg.Equity',
        //             value: this.CentralBank.liabilities.find(x => x.name == 'Equity').value
        //                 + this.Banks.assets.find(x => x.name == 'Currancy').value
        //                 + this.Households.assets.find(x => x.name == 'Currancy').value
        //                 + this.Banks.assets.find(x => x.name == 'Reserves').value
        //                 + this.Households.assets.find(x => x.name == 'Treasuries').value
        //         },
        //         { name: 'T.Deposits', value: 40 }],
        //     liabilities: [{
        //         name: 'Treasuries',
        //         value: this.Treasury.assets.find(x => x.name == 'Neg.Equity').value
        //             + this.Treasury.assets.find(x => x.name == 'T.Deposits').value
        //     }]
        // }
        // this.CentralBank = {
        //     name: 'Central Bank (Federal Government)',
        //     assets: [{
        //         name: 'Treasuries',
        //         value: this.CentralBank.liabilities.find(x => x.name == 'Equity').value
        //             + this.CentralBank.liabilities.find(x => x.name == 'Currancy').value
        //             + this.CentralBank.liabilities.find(x => x.name == 'Deposits').value
        //     }],
        //     liabilities: [
        //         { name: 'Equity', value: 10 },
        //         {
        //             name: 'Currency',
        //             value: this.Banks.assets.find(x => x.name == 'Currancy').value
        //                 + this.Households.assets.find(x => x.name == 'Currancy').value
        //         }, {
        //             name: 'Deposits',
        //             value: this.Treasury.assets.find(x => x.name == 'T.Deposits').value
        //                 + this.Banks.assets.find(x => x.name == 'Reserves').value
        //         }]
        // }
        // this.Banks = {
        //     name: 'Banks',
        //     assets: [{ name: 'Currancy', value: 40 }, { name: 'Reserves', value: 80 }],
        //     liabilities: [
        //         {
        //             name: 'Equity',
        //             value: this.Banks.assets.find(x => x.name == 'Reserves').value
        //                 + this.Banks.assets.find(x => x.name == 'Currancy').value
        //                 - this.Banks.liabilities.find(x => x.name == 'Deposits').value
        //         },
        //         {
        //             name: 'Deposits',
        //             value: this.Households.assets.find(x => x.name == 'Deposits').value
        //                 + this.Companies.assets.find(x => x.name == 'Deposits').value
        //         }]
        // }
        // this.Households = {
        //     name: 'Households',
        //     assets: [{ name: 'Currancy', value: 0 }, { name: 'Deposits', value: 40 }, { name: 'Treasuries', value: 40 }],
        //     liabilities: [
        //         {
        //             name: 'Equity',
        //             value: this.Households.assets.find(x => x.name == 'Treasuries').value
        //                 + this.Households.assets.find(x => x.name == 'Deposits').value
        //                 + this.Households.assets.find(x => x.name == 'Currancy').value
        //         }]
        // }
        // this.Companies = {
        //     name: 'Companies',
        //     assets: [{ name: 'Deposits', value: 40 }],
        //     liabilities: [
        //         {
        //             name: 'Equity',
        //             value: this.Companies.assets.find(x => x.name == 'Deposits').value
        //         }]
        // }
    }
}
