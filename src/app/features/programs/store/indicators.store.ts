import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@shared/services/toast';
import { IIndicator } from '@shared/models';

interface IIndicatorsStore {
  isLoading: boolean;
  indicators: IIndicator[];
}

export interface IndicatorDto {
  year: number;
  category: string;
  metrics: Record<string, number>[];
}

export const IndicatorsStore = signalStore(
  withState<IIndicatorsStore>({ isLoading: false, indicators: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _toast, ...store }) => ({
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
    ),
    addIndicator: rxMethod<{ id: string; indicators: IndicatorDto }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, indicators }) =>
          _http.post<{ data: IIndicator[] }>(`programs/indicators/${id}`, indicators).pipe(
            tap(() => {
              _toast.showSuccess('Les indicateurs ont été ajoutés');
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite");
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    )
  }))
);
