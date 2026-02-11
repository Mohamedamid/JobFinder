import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job, ArbeitnowResponse } from '../models/job.model';

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

  toggleFav(job: Job): void {
    job.isFavorite = !job.isFavorite;
    this.saveFavorites();
  }

  private saveFavorites(): void {
    const favorites = this.getFavorites();
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  private getFavorites(): Job[] {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

}