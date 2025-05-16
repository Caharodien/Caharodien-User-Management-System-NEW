import { AccountService } from '@app/_services';
export function appInitializer(accountService: AccountService) {
    return () => new Promise<void>(resolve => {
        accountService.refreshToken()
            .subscribe()
            .add(resolve);
    });
}