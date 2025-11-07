import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IEvent } from '@shared/models/entities.models';
import { EventDto } from '../../dto/events/event.dto';

interface IUpdateEventStore {
  isLoading: boolean;
  event: IEvent | null;
}

export const UpdateEventStore = signalStore(
  withState<IUpdateEventStore>({ isLoading: false, event: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    updateEvent: rxMethod<EventDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((event) => {
          return _http.patch<{ data: IEvent }>(`events/${event.id}`, event).pipe(
            map(({ data }) => {
              _toast.showSuccess("L'événement a été mis à jour avec succès");
              _router.navigate(['/events']);
              patchState(store, { isLoading: false, event: data });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la mise à jour");
              patchState(store, { isLoading: false, event: null });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
