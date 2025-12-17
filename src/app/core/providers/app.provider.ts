import { EnvironmentProviders, inject, provideAppInitializer, Provider } from '@angular/core';
import { appConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { AuthStore } from '../auth/auth.store';
import { IUser } from '@shared/models';
import { APP_CONFIG } from '@shared/services/config';

export const provideApp = (): EnvironmentProviders[] => {
  const providers: Provider | EnvironmentProviders = [
    { provide: APP_CONFIG, useValue: appConfig || {} },
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      const http = inject(HttpClient);
      return http.get<{ data: IUser }>('auth/profile').pipe(
        map(({ data }) => {
          authStore.setUser(data);
        }),
        catchError(() => {
          authStore.setUser(null);
          return of(null);
        })
      );
    })
  ];
  return providers;
};
