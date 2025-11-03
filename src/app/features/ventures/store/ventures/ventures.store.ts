import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, switchMap } from 'rxjs';
import { FilterVenturesDto } from '../../dto/filter-venture.dto';
import { buildQueryParams } from '@shared/helpers';
import { IVenture } from '@shared/models/entities.models';

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
          return _http.get<{ data: [IVenture[], number] }>('ventures/by-user/paginated', { params }).pipe(
            tap(({ data }) => patchState(store, { isLoading: false, ventures: data })),
            catchError(() => {
              patchState(store, { isLoading: false, ventures: [[], 0] });
              return of([]);
            })
          );
        })
      )
    ),
    deleteVenture: (id: string) => {
      const [ventures, total] = store.ventures();
      const updatedVentures = ventures.filter((venture) => venture.id !== id);
      patchState(store, { ventures: [updatedVentures, total - 1] });
    }
  }))
);
