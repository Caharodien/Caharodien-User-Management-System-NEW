import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Department } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Department[]> {
        return this.http.get<Department[]>(`${environment.apiUrl}/departments`);
    }

    getById(id: number): Observable<Department> {
        return this.http.get<Department>(`${environment.apiUrl}/departments/${id}`);
    }

    create(department: Department): Observable<Department> {
        return this.http.post<Department>(`${environment.apiUrl}/departments`, department);
    }

    update(id: number, params: any): Observable<Department> {
        return this.http.put<Department>(`${environment.apiUrl}/departments/${id}`, params);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/departments/${id}`);
    }
}