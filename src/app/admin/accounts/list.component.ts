import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    accounts!: any[];
    
    constructor(private accountService: AccountService) {}
    
    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }
    
    deleteAccount(id: string) {
        const account = this.accounts.find(x => x.id === id);
        if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            account.isDeleting = true;
            this.accountService.delete(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.accounts = this.accounts.filter(x => x.id !== id);
                    },
                    error: (error: any) => {
                        account.isDeleting = false;
                        console.error(error);
                    }
                });
        }
    }
    
    toggleActivation(account: any) {
        if (confirm(`Are you sure you want to ${account.isActive ? 'deactivate' : 'activate'} this account?`)) {
            account.isToggling = true;
            const updatedData = { isActive: !account.isActive };
            this.accountService.update(account.id, updatedData)
                .pipe(first())
                .subscribe({
                    next: (updatedAccount: any) => {
                        account.isActive = !account.isActive;
                        account.isToggling = false;
                    },
                    error: (error: any) => {
                        account.isToggling = false;
                        console.error(error);
                    }
                });
        }
    }
}