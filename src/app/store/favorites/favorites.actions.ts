import { createAction, props } from '@ngrx/store';
import { Favorite } from '../../core/models/favorite.model';

export const loadFavorites = createAction('[Favorites] Load', props<{ userId: number }>());
export const clearFavorites = createAction('[Favorites] Clear');

export const loadFavoritesSuccess = createAction('[Favorites] Load Success', props<{ favorites: Favorite[] }>());
export const loadFavoritesFailure = createAction('[Favorites] Load Failure', props<{ error: string }>());

export const addFavoriteFailure = createAction('[Favorites] Add Failure', props<{ error: string }>());
export const removeFavoriteFailure = createAction('[Favorites] Remove Failure', props<{ error: string }>());

export const addFavorite = createAction('[Favorites] Add', props<{ favorite: Favorite }>());
export const addFavoriteSuccess = createAction('[Favorites] Add Success', props<{ favorite: Favorite }>());

export const removeFavorite = createAction('[Favorites] Remove', props<{ id: number; offerId: string }>());
export const removeFavoriteSuccess = createAction('[Favorites] Remove Success', props<{ offerId: string }>());

export const deleteAllFavorites = createAction('[Favorites] Delete All', props<{ userId: number }>());