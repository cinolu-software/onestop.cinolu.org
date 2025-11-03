import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { IEvent } from '@shared/models';
import { buildQueryParams } from '@shared/helpers';
import { FilterEventsDto } from '../../dto/categories/filter-events.dto';

interface IEventsStore {
  isLoading: boolean;
  events: [IEvent[], number];
}

export const EventsPublishStore = signalStore(
  withState<IEventsStore>({ isLoading: false, events: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadEvents: rxMethod<FilterEventsDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IEvent[], number] }>('events/find-published', { params }).pipe(
            tap(({ data }) => patchState(store, { isLoading: false, events: data })),
            catchError(() => {
              patchState(store, { isLoading: false, events: [[], 0] });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
