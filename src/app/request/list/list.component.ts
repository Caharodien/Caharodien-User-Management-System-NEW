import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';

import { RequestService, AlertService } from '@app/_services';
import { Request } from '@app/_models';

@Component({ 
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: 'list.component.html' 
})
export class ListComponent implements OnInit {
    requests: Request[] = [];
    loading = false;
    deleting = false;

    constructor(
        private requestService: RequestService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.loadRequests();
    }

    private loadRequests() {
        this.requestService.getAll()
            .pipe(first())
            .subscribe(
                requests => {
                    this.requests = requests;
                    this.loading = false;
                },
                error => {
                    this.alertService.error('Error loading requests: ' + error);
                    this.loading = false;
                }
            );
    }

    deleteRequest(id: number) {
        if (confirm('Are you sure you want to delete this request?')) {
            this.deleting = true;
            this.requestService.delete(id)
                .pipe(first())
                .subscribe(
                    () => {
                        this.alertService.success('Request deleted successfully');
                        this.requests = this.requests.filter(x => x.id !== id);
                        this.deleting = false;
                    },
                    error => {
                        this.alertService.error('Error deleting request: ' + error);
                        this.deleting = false;
                    }
                );
        }
    }
}