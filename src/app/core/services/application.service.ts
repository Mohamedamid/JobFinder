import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:3000/applications';

  getApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.API_URL}?userId=${userId}`);
  }

  addApplication(app: Application): Observable<Application> {
    return this.http.post<Application>(this.API_URL, app);
  }

  updateApplication(app: Application): Observable<Application> {
    return this.http.put<Application>(`${this.API_URL}/${app.id}`, app);
  }

  deleteApplication(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}