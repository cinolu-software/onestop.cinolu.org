import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, switchMap } from 'rxjs';
import { ProgramReport } from '../types/stats.type';

interface IStatsStore {
  isLoading: boolean;
  report: ProgramReport[];
}

export const AdminReportStore = signalStore(
  withState<IStatsStore>({ isLoading: false, report: [] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    getAdminReport: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((year) => {
          return _http.get<{ data: ProgramReport[] }>(`programs/report/${year}`).pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false, report: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, report: [] });
              return of([]);
            })
          );
        })
      )
    )
  }))
);
