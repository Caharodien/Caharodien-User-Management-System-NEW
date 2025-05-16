import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Workflow } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(`${environment.apiUrl}/workflows`);
    }

    getById(id: number): Observable<Workflow> {
        return this.http.get<Workflow>(`${environment.apiUrl}/workflows/${id}`);
    }

    create(workflow: any): Observable<Workflow> {
        return this.http.post<Workflow>(`${environment.apiUrl}/workflows`, workflow);
    }

    update(id: number, params: any): Observable<Workflow> {
        return this.http.put<Workflow>(`${environment.apiUrl}/workflows/${id}`, params);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/workflows/${id}`);
    }
}