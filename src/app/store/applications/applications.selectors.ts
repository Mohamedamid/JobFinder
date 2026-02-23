import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './applications.reducer';

export const selectApplicationsState = createFeatureSelector<AppState>('applications');

export const selectAllApplications = createSelector(
  selectApplicationsState,
  (state) => state.items
);