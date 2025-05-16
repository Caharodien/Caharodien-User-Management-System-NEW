import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { first } from 'rxjs/operators';

import { EmployeeService, WorkflowService, RequestService, AlertService } from '@app/_services';
import { Employee, Workflow, Request } from '@app/_models';

@Component({ 
    templateUrl: 'details.component.html',
    imports: [CommonModule, RouterModule],
    standalone: true

})
export class DetailsComponent implements OnInit {
    id!: number;
    employee!: Employee;
    workflows: Workflow[] = [];
    requests: Request[] = [];
    loading = true;
    workflowsLoading = true;
    requestsLoading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private workflowService: WorkflowService,
        private requestService: RequestService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.loadEmployeeDetails();
    }

    goBackToEmployees() {
        this.router.navigate(['/employee']);
    }

    private loadEmployeeDetails() {
        this.employeeService.getById(this.id)
            .pipe(first())
            .subscribe(
                employee => {
                    this.employee = employee;
                    this.loading = false;
                    this.loadWorkflows();
                    this.loadRequests();
                },
                error => {
                    this.alertService.error('Error loading employee details: ' + error);
                    this.loading = false;
                    this.router.navigate(['../../'], { relativeTo: this.route });
                }
            );
    }

    private loadWorkflows() {
        this.workflowService.getAll()
            .pipe(first())
            .subscribe(
                workflows => {
                    this.workflows = workflows.filter(w => w.employeeId === this.id);
                    this.workflowsLoading = false;
                },
                error => {
                    this.alertService.error('Error loading workflows: ' + error);
                    this.workflowsLoading = false;
                }
            );
    }

    private loadRequests() {
        this.requestService.getAll()
            .pipe(first())
            .subscribe(
                requests => {   
                    this.requests = requests.filter(r => r.employeeId === this.id);
                    this.requestsLoading = false;
                },
                error => {
                    this.alertService.error('Error loading requests: ' + error);
                    this.requestsLoading = false;
                }
            );
    }
}