import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';

import { WorkflowService, AlertService } from '@app/_services';
import { Workflow } from '@app/_models';

@Component({ 
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: 'list.component.html' 
})
export class ListComponent implements OnInit {
    workflows: Workflow[] = [];
    loading = false;
    deleting = false;

    constructor(
        private workflowService: WorkflowService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.loadWorkflows();
    }

    private loadWorkflows() {
        this.workflowService.getAll()
            .pipe(first())
            .subscribe(
                (workflows: Workflow[]) => {
                    this.workflows = workflows;
                    this.loading = false;
                },
                (error: any) => {
                    this.alertService.error('Error loading workflows: ' + error);
                    this.loading = false;
                }
            );
    }

    deleteWorkflow(id: number) {
        if (confirm('Are you sure you want to delete this workflow?')) {
            this.deleting = true;
            this.workflowService.delete(id)
                .pipe(first())
                .subscribe(
                    () => {
                        this.alertService.success('Workflow deleted successfully');
                        this.workflows = this.workflows.filter(x => x.id !== id);
                        this.deleting = false;
                    },
                    (error: any) => {
                        this.alertService.error('Error deleting workflow: ' + error);
                        this.deleting = false;
                    }
                );
        }
    }
}