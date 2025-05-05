// src/app/admin/layout.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({ 
    templateUrl: 'layout.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class LayoutComponent {
    constructor(private router: Router) { }
}