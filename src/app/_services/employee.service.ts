import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee, EmployeeCreate, EmployeeUpdate } from '../_models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Employee[]>(`${environment.apiUrl}/employees`);
    }

    getById(id: number) {
        return this.http.get<Employee>(`${environment.apiUrl}/employees/${id}`);
    }

    create(employee: EmployeeCreate) {
        return this.http.post<Employee>(`${environment.apiUrl}/employees`, employee);
    }

    update(id: number, params: EmployeeUpdate) {
        return this.http.put<Employee>(`${environment.apiUrl}/employees/${id}`, params);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/employees/${id}`);
    }

    transfer(id: number, departmentId: number) {
        return this.http.post(`${environment.apiUrl}/employees/${id}/transfer`, { departmentId });
    }
}