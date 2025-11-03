import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { IndicatorsStore } from '@features/programs/store/programs/indicators.store';
import { IEvent } from '@shared/models';

interface IEventStore {
  isLoading: boolean;
  event: IEvent | null;
}

export const EventStore = signalStore(
  withState<IEventStore>({ isLoading: false, event: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _indicatorsStore: inject(IndicatorsStore)
  })),
  withMethods(({ _http, _indicatorsStore, ...store }) => ({
    loadEvent: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) => {
          return _http.get<{ data: IEvent }>(`events/slug/${slug}`).pipe(
            tap(({ data }) => {
              _indicatorsStore.loadIndicators({
                programId: data.program.program.id,
                year: new Date(data.started_at).getFullYear()
              });
              patchState(store, { isLoading: false, event: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
