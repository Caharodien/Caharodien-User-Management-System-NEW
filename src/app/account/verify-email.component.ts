// src/app/account/verify-email.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from '../_services';
import { AccountService } from '../_services/account.service';

@Component({ templateUrl: 'verify-email.component.html' })
export class VerifyEmailComponent implements OnInit {
    token: string | null = null;
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.token = this.route.snapshot.queryParams['token'];
        
        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        this.verifyEmail();
    }

    verifyEmail() {
        this.loading = true;
        
        this.accountService.verifyEmail(this.token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}