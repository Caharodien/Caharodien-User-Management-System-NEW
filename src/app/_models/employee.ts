import { Department } from './department';
export class Employee {
    id?: number;
    employeeId!: string;  
    position!: string;    
    departmentId!: number;
    firstName?: string;  
    lastName?: string;   
    email?: string;       
    hireDate!: Date;      
    status: string = 'Active';
    created?: Date;
    department?: Department;

        account?: {
        id?: number;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
}

export class EmployeeCreate {
    employeeId!: string;  
    firstName!: string;   
    lastName!: string;    
    email?: string;      
    position!: string;    
    departmentId!: number; 
    hireDate!: Date;     
}

export class EmployeeUpdate {
    firstName?: string;   
    lastName?: string;   
    email?: string;       
    position?: string;
    departmentId?: number;
    status?: string;
}