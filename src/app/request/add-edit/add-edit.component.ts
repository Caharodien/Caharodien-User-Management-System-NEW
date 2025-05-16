import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { RequestService, EmployeeService, AlertService } from '@app/_services';
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
        private requestService: RequestService,
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
            description: [''],
            items: this.formBuilder.array([])
        });

        if (this.isAddMode) {
            this.addItem();
        }

        const employeeId = this.route.snapshot.queryParams['employeeId'];
        if (employeeId) {
            this.form.patchValue({ employeeId });
        }

        if (!this.isAddMode) {
            this.loading = true;
            this.requestService.getById(this.id)
                .pipe(first())
                .subscribe(
                    request => {
                        this.form.patchValue({
                            employeeId: request.employeeId,
                            type: request.type,
                            description: request.description
                        });
                        
                        this.items.clear();
                        if (request.requestItems && request.requestItems.length) {
                            request.requestItems.forEach(item => {
                                this.items.push(this.formBuilder.group({
                                    id: [item.id],
                                    name: [item.name, [Validators.required, Validators.maxLength(100)]],
                                    description: [item.description],
                                    quantity: [item.quantity, [Validators.required, Validators.min(1)]]
                                }));
                            });
                        } else {
                            this.addItem();
                        }
                        
                        this.loading = false;
                    },
                    error => {
                        this.alertService.error('Error loading request: ' + error);
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
    get items() { return this.form.get('items') as FormArray; }
    
    addItem() {
        this.items.push(this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: [''],
            quantity: [1, [Validators.required, Validators.min(1)]]
        }));
    }
    
    removeItem(index: number) {
        if (this.items.length > 1) {
            this.items.removeAt(index);
        } else {
            this.alertService.error('At least one item is required');
        }
    }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createRequest();
        } else {
            this.updateRequest();
        }
    }
    
    private createRequest() {
        this.requestService.create(this.form.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.success('Request added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error('Error adding request: ' + error);
                    this.loading = false;
                }
            );
    }

    private updateRequest() {
        this.requestService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.success('Request updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error('Error updating request: ' + error);
                    this.loading = false;
                }
            );
    }
}