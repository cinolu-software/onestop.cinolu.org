import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IVenture } from '@shared/models/entities.models';

interface IVentureStore {
  isLoading: boolean;
  venture: IVenture | null;
}

export const VentureStore = signalStore(
  withState<IVentureStore>({ isLoading: false, venture: null }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    loadVenture: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, venture: null })),
        switchMap((slug) => {
          return _http.get<{ data: IVenture }>(`ventures/by-slug/${slug}`).pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false, venture: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, venture: null });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
