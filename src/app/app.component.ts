// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from './_services';
import { User, Role } from './_models';
import { AlertComponent } from './components/alert.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    CommonModule,  // For ngClass and other directives
    RouterModule,  // For router-outlet
    AlertComponent  // For <alert> component
  ]
})
export class AppComponent {
  Role = Role;
  user?: User | null;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.accountService.logout();
  }
}