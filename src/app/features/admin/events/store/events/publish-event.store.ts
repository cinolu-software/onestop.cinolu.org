import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventsStore } from './events.store';
import { IEvent } from '@shared/models/entities.models';

interface IPublishEventStore {
  isLoading: boolean;
  event: IEvent | null;
}

export const PublishEventStore = signalStore(
  withState<IPublishEventStore>({ isLoading: false, event: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _eventsStore: inject(EventsStore),
  })),
  withMethods(({ _http, _eventsStore, ...store }) => ({
    publishEvent: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.post<{ data: IEvent }>(`events/publish/${id}`, {}).pipe(
            map(({ data }) => {
              _eventsStore.updateEvent(data);
              patchState(store, { isLoading: false, event: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, event: null });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
