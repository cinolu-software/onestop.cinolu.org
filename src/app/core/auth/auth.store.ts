import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, exhaustMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from '../../shared/services/toast/toastr.service';
import { Router } from '@angular/router';
import { IUser } from '@shared/models';

interface IAuthStore {
  user: IUser | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<IAuthStore>({ user: null, isLoading: false, isInitialized: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router)
  })),
  withMethods(({ _http, _toast, _router, ...store }) => ({
    getProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() =>
          _http.get<{ data: IUser }>('auth/profile').pipe(
            tap(({ data }) => {
              patchState(store, { user: data, isLoading: false, isInitialized: true });
            }),
            catchError(() => {
              patchState(store, { user: null, isLoading: false, isInitialized: true });
              return of(null);
            })
          )
        )
      )
    ),
    signOut: rxMethod<void>(
      pipe(
        exhaustMap(() =>
          _http.post<void>('auth/sign-out', {}).pipe(
            tap(() => {
              _router.navigate(['/sign-in']);
              patchState(store, { user: null });
              _toast.showSuccess('Déconnexion réussie');
            }),
            catchError(() => {
              _toast.showError('Erreur lors de la déconnexion');
              return of(null);
            })
          )
        )
      )
    ),
    setUser: (user: IUser | null) => {
      patchState(store, { user, isInitialized: true });
    }
  }))
);
