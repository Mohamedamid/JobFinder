import { createAction, props } from '@ngrx/store';
import { Application } from '../../core/models/application.model';

export const loadApps = createAction('[Apps] Load', props<{ userId: number }>());
export const clearApps = createAction('[Apps] Clear');

export const loadAppsSuccess = createAction('[Apps] Load Success', props<{ apps: Application[] }>());
export const loadAppsFailure = createAction('[Apps] Load Failure', props<{ error: string }>());

export const addApp = createAction('[Apps] Add', props<{ app: Application }>());
export const addAppSuccess = createAction('[Apps] Add Success', props<{ app: Application }>());
export const addAppFailure = createAction('[Apps] Add Failure', props<{ error: string }>());

export const updateApp = createAction('[Apps] Update', props<{ app: Application }>());
export const updateAppSuccess = createAction('[Apps] Update Success', props<{ app: Application }>());
export const updateAppFailure = createAction('[Apps] Update Failure', props<{ error: string }>());

export const deleteApp = createAction('[Apps] Delete', props<{ id: number }>());
export const deleteAppSuccess = createAction('[Apps] Delete Success', props<{ id: number }>());
export const deleteAppFailure = createAction('[Apps] Delete Failure', props<{ error: string }>());

// ... existing actions
export const deleteAllApplications = createAction('[Apps] Delete All', props<{ userId: number }>());