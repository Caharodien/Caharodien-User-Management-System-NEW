import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'add', component: AddEditComponent },
    { path: 'edit/:id', component: AddEditComponent },
    { path: 'details/:id', component: DetailsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkflowRoutingModule { }