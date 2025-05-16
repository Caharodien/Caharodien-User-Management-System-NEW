import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: 'overview.component.html'
})
export class OverviewComponent { }