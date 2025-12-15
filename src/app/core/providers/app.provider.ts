import { EnvironmentProviders, inject, provideAppInitializer, Provider } from '@angular/core';
import { APP_CONFIG } from '../../shared/services/config/config.constants';
import { appConfig } from '../../app.config';
import { AuthStore } from '../auth/auth.store';

export const provideApp = (): EnvironmentProviders[] => {
  const providers: Provider | EnvironmentProviders = [
    { provide: APP_CONFIG, useValue: appConfig || {} },
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      authStore.getProfile();
    })
  ];
  return providers;
};
