import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withProps, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, exhaustMap } from 'rxjs';
import { IUserStats } from '../types/stats.type';

interface IStatsStore {
  isLoading: boolean;
  stats: IUserStats | null;
}

export const UserStatsStore = signalStore(
  withState<IStatsStore>({ isLoading: false, stats: null }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    getUserStats: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return _http.get<{ data: IUserStats }>('stats/user').pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false, stats: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, stats: null });
              return of([]);
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit({ getUserStats }) {
      getUserStats();
    },
  }),
);
