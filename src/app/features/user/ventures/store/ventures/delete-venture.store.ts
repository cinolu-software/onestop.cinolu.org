import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VenturesStore } from './ventures.store';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IDeleteVentureStore {
  isLoading: boolean;
}

export const DeleteVentureStore = signalStore(
  withState<IDeleteVentureStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _enterprisesStore: inject(VenturesStore),
  })),
  withMethods(({ _http, _toast, _enterprisesStore, ...store }) => ({
    deleteVenture: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete(`ventures/${id}`).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              _enterprisesStore.deleteVenture(id);
              _toast.showSuccess('Entreprise supprimée');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la suppression');
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
