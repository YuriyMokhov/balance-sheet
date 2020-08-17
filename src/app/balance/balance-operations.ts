import { BalanceElement } from './balance-element';
import { BalanceElementService } from './balance-elements.service';
import { Injectable } from '@angular/core';


interface IBalanceOperation {
    value: string,
    text: string,
    run(value: number): void,
    replay(value: number): void,
    reverse(value: number): void,
    reset(): void
};

export abstract class BalanceOperationBase implements IBalanceOperation {
    balanceElementService: BalanceElementService;
    constructor(balanceElementService: BalanceElementService) {
        this.balanceElementService = balanceElementService;

    }
    abstract value: string;
    abstract text: string;
    abstract run(value: number): void;
    abstract replay(value: number): void;
    abstract reverse(value: number): void;
    reset() {
        this.balanceElementService.resetAll();
    };


}
export class PrivateSpending extends BalanceOperationBase {
    balanceElementService: BalanceElementService;

    constructor(balanceElementService: BalanceElementService) {
        super(balanceElementService);
        this.balanceElementService = balanceElementService;


    }

    value: string = 'privatespending';
    text: string = 'Изменить частные расходы';


    run(value: number): void {
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value -= value;
        this.balanceElementService.Companies.assets.find(x => x.name == 'Deposits').value += value;
        this.balanceElementService.recalculateAll();
    }

    replay(value: number) {
        this.reverse(value);
        this.run(value);
    };

    reverse(value: number) {
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value += value;
        this.balanceElementService.Companies.assets.find(x => x.name == 'Deposits').value -= value;
        this.balanceElementService.recalculateAll();
    };

}


export class GovernmentSpending extends BalanceOperationBase {
    balanceElementService: BalanceElementService;

    constructor(balanceElementService: BalanceElementService) {
        super(balanceElementService);
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

}


@Injectable({
    providedIn: 'root'
})
export class BalanceOperations {
    private balanceElementService: BalanceElementService;
    constructor(balanceElementService: BalanceElementService) {
        this.balanceElementService = balanceElementService;
    }

    getBalanceOperations(): BalanceOperationBase[] {
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