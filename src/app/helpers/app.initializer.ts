import { AccountService } from '@app/_services';

export function appInitializer(AccountService: AccountService) {
    return () => new Promise(resolve => {
        //attempt to refresh token on app start up to auto authenticate
        AccountService.refreshToken()
            .subscribe()
            .add(resolve);
    });
}