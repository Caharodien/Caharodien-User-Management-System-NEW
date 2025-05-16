import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { WorkflowService, EmployeeService, AlertService } from '@app/_services';
import { Employee } from '@app/_models';

@Component({     
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl: 'add-edit.component.html' 
})
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id!: number;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    employees: Employee[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private workflowService: WorkflowService,
        private employeeService: EmployeeService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        this.loadEmployees();
        
        this.form = this.formBuilder.group({
            employeeId: ['', Validators.required],
            type: ['', Validators.required],
            description: ['']
        });

        const employeeId = this.route.snapshot.queryParams['employeeId'];
        if (employeeId) {
            this.form.patchValue({ employeeId });
        }

        if (!this.isAddMode) {
            this.loading = true;
            this.workflowService.getById(this.id)
                .pipe(first())
                .subscribe(
                    workflow => {
                        this.form.patchValue(workflow);
                        this.loading = false;
                    },
                    error => {
                        this.alertService.error('Error loading workflow: ' + error);
                        this.loading = false;
                        this.router.navigate(['../'], { relativeTo: this.route });
                    }
                );
        }
    }

    private loadEmployees() {
        this.employeeService.getAll()
            .pipe(first())
            .subscribe(
                employees => this.employees = employees,
                error => this.alertService.error('Error loading employees: ' + error)
            );
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createWorkflow();
        } else {
            this.updateWorkflow();
        }
    }

    private createWorkflow() {
        this.workflowService.create(this.form.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.success('Workflow added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error('Error adding workflow: ' + error);
                    this.loading = false;
                }
            );
    }

    private updateWorkflow() {
        this.workflowService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.success('Workflow updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error('Error updating workflow: ' + error);
                    this.loading = false;
                }
            );
    }
}