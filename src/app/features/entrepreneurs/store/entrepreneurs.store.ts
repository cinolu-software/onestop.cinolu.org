import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IUser } from '@shared/models';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, exhaustMap } from 'rxjs';

interface IEntrepreneursStore {
  isLoading: boolean;
  entrepreneurs: IUser[];
}

export const EntrepreneursStore = signalStore(
  withState<IEntrepreneursStore>({ isLoading: false, entrepreneurs: [] }),
  withMethods((store, http = inject(HttpClient)) => ({
    loadEntrepreneurs: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return http.get<{ data: IUser[] }>('users/entrepreneurs').pipe(
            tap(({ data }) => patchState(store, { isLoading: false, entrepreneurs: data })),
            catchError(() => {
              patchState(store, { isLoading: false, entrepreneurs: [] });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
