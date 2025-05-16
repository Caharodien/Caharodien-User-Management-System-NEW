import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DepartmentService, AlertService } from '@app/_services';

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

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.maxLength(500)]
        });

        if (!this.isAddMode) {
            this.loading = true;
            this.departmentService.getById(this.id)
                .pipe(first())
                .subscribe(
                    department => {
                        this.form.patchValue(department);
                        this.loading = false;
                    },
                    error => {
                        this.alertService.error('Error loading department: ' + error);
                        this.loading = false;
                        this.router.navigate(['../'], { relativeTo: this.route });
                    }
                );
        }
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
            this.createDepartment();
        } else {
            this.updateDepartment();
        }
    }

    private createDepartment() {
        this.departmentService.create(this.form.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.success('Department added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error('Error adding department: ' + error);
                    this.loading = false;
                }
            );
    }

    private updateDepartment() {
        this.departmentService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.success('Department updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error('Error updating department: ' + error);
                    this.loading = false;
                }
            );
    }
}