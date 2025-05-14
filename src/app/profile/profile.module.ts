import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.components';
import { UpdateComponent } from './update.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProfileRoutingModule,
        // Import standalone components
        LayoutComponent,
        DetailsComponent,
        UpdateComponent
    ],
    // No declarations
})
export class ProfileModule { }