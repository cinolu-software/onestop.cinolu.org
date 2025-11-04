import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, of, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IVenture } from '@shared/models/entities.models';

interface IVentureStore {
  isLoading: boolean;
  ventures: IVenture[];
}

export const unpaginatedVenturesStore = signalStore(
  withState<IVentureStore>({ isLoading: false, ventures: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    loadVentures: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, ventures: [] })),
        exhaustMap(() => {
          return _http.get<{ data: IVenture[] }>('ventures/by-user/unpaginated').pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false, ventures: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, ventures: [] });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit: ({ loadVentures }) => {
      loadVentures();
    },
  }),
);
