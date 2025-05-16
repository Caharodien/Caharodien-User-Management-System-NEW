import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Request } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class RequestService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Request[]> {
        return this.http.get<Request[]>(`${environment.apiUrl}/requests`);
    }

    getById(id: number): Observable<Request> {
        return this.http.get<Request>(`${environment.apiUrl}/requests/${id}`);
    }

    create(request: any): Observable<Request> {
        return this.http.post<Request>(`${environment.apiUrl}/requests`, request);
    }

    update(id: number, params: any): Observable<Request> {
        return this.http.put<Request>(`${environment.apiUrl}/requests/${id}`, params);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/requests/${id}`);
    }
}