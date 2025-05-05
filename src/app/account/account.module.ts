// src/app/account/account.module.ts
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { VerifyEmailComponent } from './verify-email.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        // Import standalone components
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        ResetPasswordComponent,
        // Add ForgotPasswordComponent only if it's also standalone
        // ForgotPasswordComponent
    ],
    declarations: [
        // Only non-standalone components should be here
        // If ForgotPasswordComponent is not standalone, it should be here
        ForgotPasswordComponent
    ]
})
export class AccountModule { }