import { Component } from '@angular/core';
import { AccountService } from '../_services/account.service';
@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    account: any;
    constructor(private accountService: AccountService) {       
        this.account = this.accountService.accountValue; 
    }
}