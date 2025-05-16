import { Employee } from './employee';
import { RequestItem, RequestItemCreate } from './request-item';

export class Request {
    id?: number;
    employeeId!: number;  
    type!: string;  
    description?: string;
    status: string = 'Pending';  
    created?: Date;
    employee?: Employee;
    requestItems?: RequestItem[];
}

export class RequestCreate {
    employeeId!: number; 
    type!: string;
    items!: RequestItemCreate[];  
    description?: string;
}

export class RequestUpdate {
    status!: string;  
    description?: string;
}