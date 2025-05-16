import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { DetailsComponent } from './details/details.component';
import { TransferComponent } from './transfer/transfer.component';

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'add', component: AddEditComponent },
    { path: 'edit/:id', component: AddEditComponent },
    { path: 'details/:id', component: DetailsComponent },
    { path: 'transfer/:id', component: TransferComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }