import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@core/services/toast/toastr.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, of, pipe, tap } from 'rxjs';
import { IUser } from '@shared/models/entities.models';
import { AuthStore } from '@core/auth/auth.store';

interface IReferralCode {
  isLoading: boolean;
}

export const OutreachStore = signalStore(
  withState<IReferralCode>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _authStore: inject(AuthStore)
  })),
  withMethods(({ _http, _toast, _authStore, ...store }) => ({
    generateCode: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return _http.post<{ data: IUser }>('users/generate/referralCode', {}).pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false });
              _authStore.setUser(data);
              _toast.showSuccess('Lien généré avec succès');
            }),
            catchError(() => {
              _toast.showError('Erreur lors de la génération du lien');
              patchState(store, { isLoading: false });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
