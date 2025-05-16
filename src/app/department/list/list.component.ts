import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';

import { DepartmentService, AlertService } from '@app/_services';
import { Department } from '@app/_models';

@Component({ 
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: 'list.component.html' 
})
export class ListComponent implements OnInit {
    departments: Department[] = [];
    loading = false;
    deleting = false;

    constructor(
        private departmentService: DepartmentService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.loadDepartments();
    }

    private loadDepartments() {
        this.departmentService.getAll()
            .pipe(first())
            .subscribe(
                (departments: Department[]) => {
                    this.departments = departments;
                    this.loading = false;
                },
                (error: any) => {
                    this.alertService.error('Error loading departments: ' + error);
                    this.loading = false;
                }
            );
    }

    deleteDepartment(id: number) {
        if (confirm('Are you sure you want to delete this department?')) {
            this.deleting = true;
            this.departmentService.delete(id)
                .pipe(first())
                .subscribe(
                    () => {
                        this.alertService.success('Department deleted successfully');
                        this.departments = this.departments.filter(x => x.id !== id);
                        this.deleting = false;
                    },
                    (error: any) => {
                        this.alertService.error('Error deleting department: ' + error);
                        this.deleting = false;
                    }
                );
        }
    }
}