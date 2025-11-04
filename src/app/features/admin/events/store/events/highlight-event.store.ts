import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@core/services/toast/toastr.service';
import { EventsStore } from './events.store';
import { IEvent } from '@shared/models/entities.models';

interface IHighlightStore {
  isLoading: boolean;
}

export const HighlightEventStore = signalStore(
  withState<IHighlightStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _eventsStore: inject(EventsStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _eventsStore, _toast, ...store }) => ({
    highlight: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.patch<{ data: IEvent }>(`events/highlight/${id}`, {}).pipe(
            map(({ data }) => {
              _eventsStore.updateEvent(data);
              _toast.showSuccess(
                data.is_highlighted ? 'Evénement mis en avant' : 'Evénement retiré des mises en avant',
              );
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError("Erreur lors de la mise en avant de l'Evénement");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
