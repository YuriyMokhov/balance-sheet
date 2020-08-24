import { BalanceOperationBase } from './balance-operation'
import { BalanceElementService } from './balance-elements.service'
import { Injectable } from '@angular/core'



@Injectable({
    providedIn: 'root'
})
export class BalanceOperationService {
    private balanceElementService: BalanceElementService;
    constructor(balanceElementService: BalanceElementService) {
        this.balanceElementService = balanceElementService;
    }

    getBalanceOperations(): BalanceOperationBase[] {
        return [new PrivateSpending(this.balanceElementService),
        new GovernmentSpending(this.balanceElementService),
        new GovernmentTaxes(this.balanceElementService),
        new GovernmentDebtIssuance(this.balanceElementService),
        new ConsolidatedGovernmentSpending(this.balanceElementService)];
    }

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
        this.balanceElementService.Treasury.assets.find(x => x.name == 'T.Deposits').value -= value;
        this.balanceElementService.Banks.assets.find(x => x.name == 'Reserves').value += value;
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value += value;
        this.balanceElementService.recalculateAll();
    }

    reverse(value: number) {
        this.balanceElementService.Treasury.assets.find(x => x.name == 'T.Deposits').value += value;
        this.balanceElementService.Banks.assets.find(x => x.name == 'Reserves').value -= value;
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value -= value;
        this.balanceElementService.recalculateAll();
    };

}

export class GovernmentTaxes extends BalanceOperationBase {
    balanceElementService: BalanceElementService;

    constructor(balanceElementService: BalanceElementService) {
        super(balanceElementService);
        this.balanceElementService = balanceElementService;
    }

    value: string = 'governmenttaxes';
    text: string = 'Изменить налоги';

    run(value: number) {
        this.balanceElementService.Treasury.assets.find(x => x.name == 'T.Deposits').value += value;
        this.balanceElementService.Banks.assets.find(x => x.name == 'Reserves').value -= value;
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value -= value;
        this.balanceElementService.recalculateAll();
    }

    reverse(value: number) {
        this.balanceElementService.Treasury.assets.find(x => x.name == 'T.Deposits').value -= value;
        this.balanceElementService.Banks.assets.find(x => x.name == 'Reserves').value += value;
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value += value;
        this.balanceElementService.recalculateAll();
    };

}


export class GovernmentDebtIssuance extends BalanceOperationBase {
    balanceElementService: BalanceElementService;

    constructor(balanceElementService: BalanceElementService) {
        super(balanceElementService);
        this.balanceElementService = balanceElementService;
    }

    value: string = 'governmentdebtissuance';
    text: string = 'Выпустить государственные займы';

    run(value: number) {
        this.balanceElementService.Treasury.assets.find(x => x.name == 'T.Deposits').value += value;
        this.balanceElementService.Banks.assets.find(x => x.name == 'Reserves').value -= value;
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value -= value;
        this.balanceElementService.Households.assets.find(x => x.name == 'Treasuries').value += value;
        this.balanceElementService.recalculateAll();
    }

    reverse(value: number) {
        this.balanceElementService.Treasury.assets.find(x => x.name == 'T.Deposits').value -= value;
        this.balanceElementService.Banks.assets.find(x => x.name == 'Reserves').value += value;
        this.balanceElementService.Households.assets.find(x => x.name == 'Deposits').value += value;
        this.balanceElementService.Households.assets.find(x => x.name == 'Treasuries').value -= value;
        this.balanceElementService.recalculateAll();
    };

}

//consolidatedgovernmentspending
export class ConsolidatedGovernmentSpending extends BalanceOperationBase {
    balanceElementService: BalanceElementService;

    constructor(balanceElementService: BalanceElementService) {
        super(balanceElementService);
        this.balanceElementService = balanceElementService;
    }

    value: string = 'consolidatedgovernmentspending';
    text: string = 'Увеличить траты государства (консолидировано)';

    run(value: number) {
        this.balanceElementService.Households.assets.find(x => x.name == 'Treasuries').value += value;
        this.balanceElementService.recalculateAll();
    }

    reverse(value: number) {
        this.balanceElementService.Households.assets.find(x => x.name == 'Treasuries').value -= value;
        this.balanceElementService.recalculateAll();
    };

}