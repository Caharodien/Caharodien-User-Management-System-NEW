import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { first } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { EmployeeService, DepartmentService, AlertService } from '@app/_services';
import { Employee, Department } from '@app/_models';

@Component({ 
    standalone: true,  
    imports: [CommonModule, ReactiveFormsModule, RouterModule], 
    templateUrl: 'transfer.component.html' 
})
export class TransferComponent implements OnInit {
    form!: FormGroup;
    id!: number;
    employee!: Employee;
    departments: Department[] = [];
    loading = true;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        
        this.form = this.formBuilder.group({
            departmentId: ['', Validators.required]
        });
        
        this.loadEmployeeDetails();
        this.loadDepartments();
    }
    
    // Add this method for the back button
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
                },
                error => {
                    this.alertService.error('Error loading employee details: ' + error);
                    this.loading = false;
                    this.router.navigate(['../../'], { relativeTo: this.route });
                }
            );
    }
    
    private loadDepartments() {
        this.departmentService.getAll()
            .pipe(first())
            .subscribe(
                departments => this.departments = departments,
                error => this.alertService.error('Error loading departments: ' + error)
            );
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        if (this.employee.departmentId === parseInt(this.form.value.departmentId)) {
            this.alertService.error('Employee is already in this department');
            return;
        }
        
        this.submitting = true;
        this.employeeService.update(this.id, { departmentId: this.form.value.departmentId })
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.success('Employee transferred successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../../details', this.id], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error('Error transferring employee: ' + error);
                    this.submitting = false;
                }
            );
    }
}