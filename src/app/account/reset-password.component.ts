// src/app/account/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';
import { MustMatch } from '../_helpers';

@Component({ 
    templateUrl: 'reset-password.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class ResetPasswordComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    token: string | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.token = this.route.snapshot.queryParams['token'];
        
        // redirect to home if no token found
        if (!this.token) {
            this.router.navigate(['/account/login']);
            return;
        }

        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        
        // Updated to match your AccountService method signature
        this.accountService.resetPassword(
            this.token!, 
            this.f.password.value, 
            this.f.confirmPassword.value
        )
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}