import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WorkflowRoutingModule } from './workflow-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        WorkflowRoutingModule,
        ListComponent,
        AddEditComponent,
        DetailsComponent
    ],
})
export class WorkflowModule { }