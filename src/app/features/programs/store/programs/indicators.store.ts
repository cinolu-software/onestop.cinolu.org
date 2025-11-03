import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IIndicator } from '@shared/models';

interface IIndicatorsStore {
  isLoading: boolean;
  indicators: IIndicator[];
}

export const IndicatorsStore = signalStore(
  withState<IIndicatorsStore>({ isLoading: false, indicators: [] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadIndicators: rxMethod<{ programId: string; year: number }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ programId, year }) => {
          return _http.get<{ data: IIndicator[] }>(`programs/indicators/${programId}/${year}`).pipe(
            tap(({ data: indicators }) => {
              patchState(store, { isLoading: false, indicators });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, indicators: [] });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
