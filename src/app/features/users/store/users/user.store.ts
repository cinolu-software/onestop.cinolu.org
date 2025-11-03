import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '@shared/models/entities.models';

interface IUserStore {
  isLoading: boolean;
  user: IUser | null;
}

export const UsersStore = signalStore(
  withState<IUserStore>({ isLoading: false, user: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _route: inject(ActivatedRoute),
  })),
  withMethods(({ _http, ...store }) => ({
    loadUser: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((email) => {
          return _http.get<{ data: IUser }>(`users/${email}`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, user: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, user: null });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit({ loadUser, _route }) {
      const email = _route.snapshot.params['email'];
      loadUser(email);
    },
  }),
);
