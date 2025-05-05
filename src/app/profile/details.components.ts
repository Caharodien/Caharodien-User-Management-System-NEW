// src/app/profile/details.component.ts
import { Component } from '@angular/core';

import { AccountService } from '../_services/account.service';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent {
  account: any; 

  constructor(private accountService: AccountService) {
    this.account = this.accountService.userValue; 
  }
}