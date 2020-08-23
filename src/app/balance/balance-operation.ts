import { BalanceElementService } from './balance-elements.service';

interface IBalanceOperation {
    value: string,
    text: string,
    run(value: number): void,
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
    abstract reverse(value: number): void;
    reset() {
        this.balanceElementService.resetAll();
    };


}

