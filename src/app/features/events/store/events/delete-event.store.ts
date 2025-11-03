import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventsStore } from './events.store';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IEvent } from '@shared/models/entities.models';

interface IDeleteEventStore {
  isLoading: boolean;
}

export const DeleteEventStore = signalStore(
  withState<IDeleteEventStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _eventsStore: inject(EventsStore),
  })),
  withMethods(({ _http, _eventsStore, _toast, ...store }) => ({
    deleteEvent: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete<{ data: IEvent }>(`events/${id}`).pipe(
            tap(() => {
              _eventsStore.deleteEvent(id);
              _toast.showSuccess("L'événement a été supprimé avec succès");
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la suppression");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
