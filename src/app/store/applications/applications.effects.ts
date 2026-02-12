import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApplicationService } from '../../core/services/application.service';
import * as AppActions from './applications.actions';
import { map, mergeMap, catchError, of } from 'rxjs';

@Injectable()
export class ApplicationsEffects {
  private actions$ = inject(Actions);
  private appService = inject(ApplicationService);

  load$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loadApps),
    mergeMap(({ userId }) => this.appService.getApplications(userId).pipe(
      map(apps => AppActions.loadAppsSuccess({ apps })),
      catchError(error => of(AppActions.loadAppsFailure({ error: error.message })))
    ))
  ));

  add$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.addApp),
    mergeMap(({ app }) => this.appService.addApplication(app).pipe(
      map(newApp => AppActions.addAppSuccess({ app: newApp })),
      catchError(error => of(AppActions.addAppFailure({ error: error.message })))
    ))
  ));

  update$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.updateApp),
    mergeMap(({ app }) => this.appService.updateApplication(app).pipe(
      map(updatedApp => AppActions.updateAppSuccess({ app: updatedApp })),
      catchError(error => of(AppActions.updateAppFailure({ error: error.message })))
    ))
  ));

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.deleteApp),
    mergeMap(({ id }) => this.appService.deleteApplication(id).pipe(
      map(() => AppActions.deleteAppSuccess({ id })),
      catchError(error => of(AppActions.deleteAppFailure({ error: error.message })))
    ))
  ));
}