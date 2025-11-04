import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from '../../../core/services/toast/toastr.service';
import { IUser } from '../../../shared/models/entities.models';
import { SignUpDto } from '../dto/sign-up.dto';

interface ISignUpStore {
  isLoading: boolean;
  user: IUser | null;
}

export const SignUpStore = signalStore(
  withState<ISignUpStore>({ isLoading: false, user: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router),
  })),
  withMethods(({ _http, _toast, _router, ...store }) => ({
    signUp: rxMethod<SignUpDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post<{ data: IUser }>('auth/sign-up', payload).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              _toast.showSuccess('Inscription réussie');
              _router.navigate(['/sign-in']);
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError("Échec de l'inscription");
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
