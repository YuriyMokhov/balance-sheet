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
                    value: null,
                    color: 'mediumblue'
                },
                { name: 'T.Deposits', value: 40, color: 'darkgreen' }],
            liabilities: [{
                name: 'Treasuries',
                value: null,
                color: 'darkred'
            }]
        }
        this.CentralBank = {
            name: 'Central Bank (Federal Government)',
            assets: [{
                name: 'Treasuries',
                value: null,
                color: 'darkgreen'
            }],
            liabilities: [
                { name: 'Equity', value: 10, color: 'mediumblue' },
                {
                    name: 'Currency',
                    value: null,
                    color: 'darkred'
                }, {
                    name: 'Deposits',
                    value: null,
                    color: 'darkred'
                }]
        }
        this.Banks = {
            name: 'Banks',
            assets: [{ name: 'Currency', value: 40, color: 'darkgreen' }, { name: 'Reserves', value: 80, color: 'darkgreen' }],
            liabilities: [
                {
                    name: 'Equity',
                    value: null,
                    color: 'mediumblue'
                },
                {
                    name: 'Deposits',
                    value: null,
                    color: 'darkred'
                }]
        }
        this.Households = {
            name: 'Households',
            assets: [{ name: 'Currency', value: 0, color: 'darkgreen' },
            { name: 'Deposits', value: 40, color: 'darkgreen' },
            { name: 'Treasuries', value: 40, color: 'darkgreen' }],
            liabilities: [
                {
                    name: 'Equity',
                    value: null,
                    color: 'mediumblue'
                }]
        }
        this.Companies = {
            name: 'Companies',
            assets: [{ name: 'Deposits', value: 40, color: 'darkgreen' }],
            liabilities: [{ name: 'Equity', value: null, color: 'mediumblue' }]
        }

        //////////////////////////
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


        // this.Treasury = {
        //     name: 'Treasury (Federal Government)',
        //     assets: [
        //         {
        //             name: 'Neg.Equity',
        //             value: this.CentralBank.liabilities.find(x => x.name == 'Equity').value
        //                 + this.Banks.assets.find(x => x.name == 'Currency').value
        //                 + this.Households.assets.find(x => x.name == 'Currency').value
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
        //             + this.CentralBank.liabilities.find(x => x.name == 'Currency').value
        //             + this.CentralBank.liabilities.find(x => x.name == 'Deposits').value
        //     }],
        //     liabilities: [
        //         { name: 'Equity', value: 10 },
        //         {
        //             name: 'Currency',
        //             value: this.Banks.assets.find(x => x.name == 'Currency').value
        //                 + this.Households.assets.find(x => x.name == 'Currency').value
        //         }, {
        //             name: 'Deposits',
        //             value: this.Treasury.assets.find(x => x.name == 'T.Deposits').value
        //                 + this.Banks.assets.find(x => x.name == 'Reserves').value
        //         }]
        // }
        // this.Banks = {
        //     name: 'Banks',
        //     assets: [{ name: 'Currency', value: 40 }, { name: 'Reserves', value: 80 }],
        //     liabilities: [
        //         {
        //             name: 'Equity',
        //             value: this.Banks.assets.find(x => x.name == 'Reserves').value
        //                 + this.Banks.assets.find(x => x.name == 'Currency').value
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
        //     assets: [{ name: 'Currency', value: 0 }, { name: 'Deposits', value: 40 }, { name: 'Treasuries', value: 40 }],
        //     liabilities: [
        //         {
        //             name: 'Equity',
        //             value: this.Households.assets.find(x => x.name == 'Treasuries').value
        //                 + this.Households.assets.find(x => x.name == 'Deposits').value
        //                 + this.Households.assets.find(x => x.name == 'Currency').value
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
