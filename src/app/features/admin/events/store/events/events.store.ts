import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { buildQueryParams } from '@shared/helpers';
import { IEvent } from '@shared/models/entities.models';
import { FilterEventCategoriesDto } from '../../dto/categories/filter-categories.dto';

interface IEventsStore {
  isLoading: boolean;
  events: [IEvent[], number];
}

export const EventsStore = signalStore(
  withState<IEventsStore>({ isLoading: false, events: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadEvents: rxMethod<FilterEventCategoriesDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IEvent[], number] }>('events', { params }).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, events: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, events: [[], 0] });
              return of(null);
            })
          );
        })
      )
    ),
    updateEvent: (event: IEvent): void => {
      const [events, count] = store.events();
      const updated = events.map((e) => (e.id === event.id ? event : e));
      patchState(store, { events: [updated, count] });
    },
    deleteEvent: (id: string): void => {
      const [events, count] = store.events();
      const filtered = events.filter((event) => event.id !== id);
      patchState(store, { events: [filtered, count - 1] });
    }
  }))
);
