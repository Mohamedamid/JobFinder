import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job} from '../models/job.model';
import { Favorite } from '../models/favorite.model';
import { ArbeitnowResponse } from '../models/arbeitnowResponse.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private API_URL = 'https://www.arbeitnow.com/api/job-board-api';
  private FAV_API = 'http://localhost:3000/favoritesOffers';

  getJobs(): Observable<Job[]> {
    return this.http.get<ArbeitnowResponse>(this.API_URL).pipe(
      map(response => response.data)
    );
  }

  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.FAV_API}?userId=${userId}`);
  }

  addFavorite(fav: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(this.FAV_API, fav);
  }

  removeFavorite(id: number): Observable<any> {
    return this.http.delete(`${this.FAV_API}/${id}`);
  }

}