import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RequestRoutingModule,
        ListComponent,
        AddEditComponent,
        DetailsComponent
    ],
})
export class RequestModule { }