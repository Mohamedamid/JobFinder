import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private http = inject(HttpClient);
  private FAV_API = 'http://localhost:3000/favoritesOffers';

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