import { AccountService } from '@app/_services';
export function appInitializer(accountService: AccountService) {
    return () => new Promise<void>(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        accountService.refreshToken()
            .subscribe({
                next: () => {
                    console.log('Token refreshed successfully');
                    resolve();
                },
                error: error => {
                    console.error('Token refresh failed', error);
                    resolve(); // Resolve anyway to continue application loading
                },
                complete: () => resolve()
            });
    });
}