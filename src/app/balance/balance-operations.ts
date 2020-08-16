import { BalanceElement } from './balance-element';
import { BalanceElementService } from './balance-elements.service';
import { Injectable } from '@angular/core';



export interface IBalanceOperation {
    value: string,
    text: string,
    run: (value: number) => void,
    replay: (value: number) => void,
    reverse: (value: number) => void,
    reset: () => void
};


export class PrivateSpending implements IBalanceOperation {
    balanceElementService: BalanceElementService;

    constructor(balanceElementService: BalanceElementService) {
        this.balanceElementService = balanceElementService;

    }

    value: string = 'privatespending';
    text: string = 'Изменить частные расходы';

    run(value: number) {
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value += value;
        this.balanceElementService.Companies.assets.find(x => x.name == 'Deposits').value += value;
        this.balanceElementService.recalculateAll();
    }

    replay(value: number) {
        // this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value -= value;
        // this.balanceElementService.Companies.assets.find(x => x.name == 'Deposits').value -= value;
        // this.balanceElementService.recalculateAll();
    };

    reverse(value: number) {
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value -= value;
        this.balanceElementService.Companies.assets.find(x => x.name == 'Deposits').value -= value;
        this.balanceElementService.recalculateAll();
    };
    reset() {
        this.balanceElementService.resetAll();
    };


}


export class GovernmentSpending implements IBalanceOperation {
    balanceElementService: BalanceElementService;

    constructor(balanceElementService: BalanceElementService) {
        this.balanceElementService = balanceElementService;

    }

    value: string = 'governmentspending';
    text: string = 'Изменить государственные расходы';

    run(value: number) {
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposit').value += value;
        this.balanceElementService.Companies.assets.find(x => x.name == 'Deposit').value += value;
        this.balanceElementService.recalculateAll();
    }

    replay(value: number) {
        // this.balanceElementService.Households.assets.find(x => x.name == 'Deposit').value -= value;
        // this.balanceElementService.Companies.assets.find(x => x.name == 'Deposit').value -= value;
        // this.balanceElementService.recalculateAll();
    };

    reverse(value: number) {
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposit').value -= value;
        this.balanceElementService.Companies.assets.find(x => x.name == 'Deposit').value -= value;
        this.balanceElementService.recalculateAll();
    };
    reset() {
        this.balanceElementService.resetAll();
    };


}


@Injectable({
    providedIn: 'root'
})
export class BalanceOperations {
    private balanceElementService: BalanceElementService;
    constructor(balanceElementService: BalanceElementService) {
        this.balanceElementService = balanceElementService;
    }

    getBalanceOperations(): IBalanceOperation[] {
        return [new PrivateSpending(this.balanceElementService), new GovernmentSpending(this.balanceElementService)];
    }

    // privateSpending(value: number) {
    //     //         Изменить частные расходы
    //     // Deposits у Households уменьшаются на значение
    //     // Deposits у Companies увеличивается на значение

    //     this.balanceElementService.Households.assets.find(x => x.name == 'Deposit').value += value;
    //     this.balanceElementService.Companies.assets.find(x => x.name == 'Deposit').value += value;
    //     this.balanceElementService.recalculateAll();
    // }

}