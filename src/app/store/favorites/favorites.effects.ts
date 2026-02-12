import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FavoriteService } from '../../core/services/favorite.service';
import * as FavActions from './favorites.actions';
import { map, mergeMap, catchError, of } from 'rxjs';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private FavoriteService = inject(FavoriteService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavActions.loadFavorites),
      mergeMap((action) =>
        this.FavoriteService.getFavorites(action.userId).pipe(
          map((favorites) => FavActions.loadFavoritesSuccess({ favorites })),
          catchError((error) => of(FavActions.loadFavoritesFailure({ error: error.message })))
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavActions.addFavorite),
      mergeMap((action) =>
        this.FavoriteService.addFavorite(action.favorite).pipe(
          map((newFav) => FavActions.addFavoriteSuccess({ favorite: newFav })),
          catchError((error) => of(FavActions.addFavoriteFailure({ error: error.message })))
        )
      )
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavActions.removeFavorite),
      mergeMap((action) =>
        this.FavoriteService.removeFavorite(action.id).pipe(
          map(() => FavActions.removeFavoriteSuccess({ offerId: action.offerId })),
          catchError((error) => of(FavActions.removeFavoriteFailure({ error: error.message })))
        )
      )
    )
  );
}