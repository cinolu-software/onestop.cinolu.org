import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterVenturesDto } from '../dto/ventures/filter-ventures.dto';
import { buildQueryParams } from '@shared/helpers';
import { IVenture } from '@shared/models';

interface IVenturesStore {
  isLoading: boolean;
  ventures: [IVenture[], number];
}

export const VenturesStore = signalStore(
  withState<IVenturesStore>({ isLoading: false, ventures: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadVentures: rxMethod<FilterVenturesDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IVenture[], number] }>('ventures', { params }).pipe(
            map(({ data }) => {
              const [ventures, total] = data;
              patchState(store, { isLoading: false, ventures: [ventures, total] });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, ventures: [[], 0] });
              return of(null);
            })
          );
        })
      )
    ),
    updateVenture: (venture: IVenture): void => {
      const [ventures, count] = store.ventures();
      const updated = ventures.map((v) => (v.slug === venture.slug ? venture : v));
      patchState(store, { ventures: [updated, count] });
    },
    deleteVenture: (id: string): void => {
      const [ventures, count] = store.ventures();
      const filtered = ventures.filter((venture) => venture.id !== id);
      patchState(store, { ventures: [filtered, count - 1] });
    }
  }))
);
