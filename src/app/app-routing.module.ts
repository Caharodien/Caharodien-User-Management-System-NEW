import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const employeeModule = () => import('./employee/employee.module').then(x => x.EmployeeModule);
const departmentModule = () => import('./department/department.module').then(x => x.DepartmentModule);
const workflowModule = () => import('./workflow/workflow.module').then(x => x.WorkflowModule);
const requestModule = () => import('./request/request.module').then(x => x.RequestModule);

export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'employee', loadChildren: employeeModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'department', loadChildren: departmentModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'workflow', loadChildren: workflowModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'request', loadChildren: requestModule, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }