
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { DetailsComponent } from './details/details.component';
import { TransferComponent } from './transfer/transfer.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EmployeeRoutingModule,
        ListComponent,
        AddEditComponent,
        DetailsComponent,
        TransferComponent
    ],
})
export class EmployeeModule { }