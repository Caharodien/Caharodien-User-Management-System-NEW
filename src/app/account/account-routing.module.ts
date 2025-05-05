// src/app/account/account-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../account/layout.component';
import { LoginComponent } from '../account/login.component';
import { RegisterComponent } from '../account/register.component';
import { VerifyEmailComponent } from '../account/verify-email.component';
import { ResetPasswordComponent } from '../account/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'verify-email', component: VerifyEmailComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }