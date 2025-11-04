import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from '../../../core/services/toast/toastr.service';
import { IUser } from '../../../shared/models/entities.models';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

interface IForgotPasswordStore {
  isLoading: boolean;
}

export const ForgotPasswordStore = signalStore(
  withState<IForgotPasswordStore>({
    isLoading: false,
  }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router),
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    forgotPassword: rxMethod<ForgotPasswordDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post<{ data: IUser }>('auth/forgot-password', payload).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              _toast.showSuccess('Lien de réinitialisation envoyé par e-mail');
              _router.navigate(['/sign-in']);
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la réinitialisation');
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
