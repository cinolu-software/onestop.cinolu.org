import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IEvent } from '@shared/models/entities.models';
import { EventDto } from '../../dto/events/event.dto';

interface IAddEventStore {
  isLoading: boolean;
  events: IEvent | null;
}

export const AddEventStore = signalStore(
  withState<IAddEventStore>({ isLoading: false, events: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    addEvent: rxMethod<EventDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((event) => {
          return _http.post<{ data: IEvent }>('events', event).pipe(
            map(({ data }) => {
              _toast.showSuccess("L'événement a été ajouté avec succès");
              _router.navigate(['/dashboard/events']);
              patchState(store, { isLoading: false, events: data });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite");
              patchState(store, { isLoading: false, events: null });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
