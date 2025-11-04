import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VenturesStore } from './ventures.store';
import { IVenture } from '@shared/models';

interface IPublishVentureStore {
  isLoading: boolean;
  venture: IVenture | null;
}

export const PublishVentureStore = signalStore(
  withState<IPublishVentureStore>({ isLoading: false, venture: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _venturesStore: inject(VenturesStore)
  })),
  withMethods(({ _http, _venturesStore, ...store }) => ({
    publishVenture: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) => {
          return _http.patch<{ data: IVenture }>(`ventures/toggle-publish/${slug}`, {}).pipe(
            map(({ data }) => {
              _venturesStore.updateVenture(data);
              patchState(store, { isLoading: false, venture: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, venture: null });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
