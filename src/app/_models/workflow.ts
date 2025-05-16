import { Employee } from './employee';

export class Workflow {
    id?: number;
    employeeId!: number;
    type!: string;
    status?: string = 'Pending';
    description?: string;
    details?: any;
    created?: Date;
    employee?: Employee;
}

export class WorkflowCreate {
    employeeId!: number;
    type!: string;
    details?: any;
}