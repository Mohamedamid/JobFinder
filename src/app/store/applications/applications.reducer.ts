import { createReducer, on } from '@ngrx/store';
import { Application } from '../../core/models/application.model';
import * as AppActions from './applications.actions';

export interface AppState {
  items: Application[];
  loading: boolean;
  error: string | null;
}

export const initialState: AppState = {
  items: [],
  loading: false,
  error: null
};

export const applicationReducer = createReducer(
  initialState,

  on(AppActions.clearApps, () => ({
    items: [],
    loading: false,
    error: null
  })),

  on(AppActions.loadApps, (state) => ({ ...state, loading: true })),
  on(AppActions.loadAppsSuccess, (state, { apps }) => ({ ...state, items: apps, loading: false })),
  
  on(AppActions.addAppSuccess, (state, { app }) => ({ 
    ...state, 
    items: [...state.items, app] 
  })),

  on(AppActions.updateAppSuccess, (state, { app }) => ({
    ...state,
    items: state.items.map(item => item.id === app.id ? app : item)
  })),

  on(AppActions.deleteAppSuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter(item => item.id !== id)
  }))
);