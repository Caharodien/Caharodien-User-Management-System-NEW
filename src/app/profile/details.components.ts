import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AccountService } from '../_services/account.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'details.component.html'
})
export class DetailsComponent {
  account: any; 

  constructor(private accountService: AccountService) {
    this.account = this.accountService.accountValue; 
  }
}