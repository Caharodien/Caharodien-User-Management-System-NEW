import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DepartmentRoutingModule,
        ListComponent,
        AddEditComponent
    ],
})
export class DepartmentModule { }