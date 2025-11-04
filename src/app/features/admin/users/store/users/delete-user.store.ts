import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface IDeleteUserStore {
  isLoading: boolean;
}

export const DeleteUserStore = signalStore(
  withState<IDeleteUserStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    deleteUser: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((userId) => {
          return _http.delete(`users/${userId}`).pipe(
            map(() => {
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
