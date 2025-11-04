import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from '../../../core/services/toast/toastr.service';
import { IUser } from '../../../shared/models/entities.models';
import { ResetPasswordDto } from '../dto/reset-password.dto';

interface IResetPasswordStore {
  isLoading: boolean;
}

export const ResetPasswordStore = signalStore(
  withState<IResetPasswordStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router),
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    resetPassword: rxMethod<ResetPasswordDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post<{ data: IUser }>('auth/reset-password', payload).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              _toast.showSuccess('Mot de passe réinitialisé avec succès');
              _router.navigate(['/sign-in']);
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la réinitialisation du mot de passe');
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
