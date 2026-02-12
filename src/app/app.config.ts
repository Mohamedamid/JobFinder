import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { FavoritesEffects } from './store/favorites/favorites.effects';
import { ApplicationsEffects } from './store/applications/applications.effects';
import { applicationReducer } from './store/applications/applications.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),

    provideStore({ favorites: favoritesReducer, applications: applicationReducer }),

    provideEffects(FavoritesEffects, ApplicationsEffects),

    provideRouter(routes),
  ],
};
