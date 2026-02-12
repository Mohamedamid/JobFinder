import { createReducer, on } from '@ngrx/store';
import { Favorite } from '../../core/models/favorite.model';
import * as FavActions from './favorites.actions';

export interface FavoritesState {
  items: Favorite[];
  loading: boolean;
}

export const initialState: FavoritesState = {
  items: [],
  loading: false,
};

export const favoritesReducer = createReducer(
  initialState,

  on(FavActions.clearFavorites, () => ({
    items: [],
    loading: false
  })),

  on(FavActions.loadFavorites, (state) => ({ ...state, loading: true })),
  
  on(FavActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    items: favorites,
    loading: false,
  })),

  on(FavActions.loadFavoritesFailure, (state) => ({
    ...state,
    loading: false
  })),

  on(FavActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    items: [...state.items, favorite],
  })),

  on(FavActions.removeFavoriteSuccess, (state, { offerId }) => ({
    ...state,
    items: state.items.filter((item) => item.offerId !== offerId),
  })),
);