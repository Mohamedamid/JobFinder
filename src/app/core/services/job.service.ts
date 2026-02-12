import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job} from '../models/job.model';
import { ArbeitnowResponse } from '../models/arbeitnowResponse.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private API_URL = 'https://www.arbeitnow.com/api/job-board-api';

  getJobs(): Observable<Job[]> {
    return this.http.get<ArbeitnowResponse>(this.API_URL).pipe(
      map(response => response.data)
    );
  }
}