import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { VentureDto } from '../../dto/venture.dto';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IVenture } from '@shared/models/entities.models';

interface IAddVentureStore {
  isLoading: boolean;
}

export const AddVentureStore = signalStore(
  withState<IAddVentureStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router),
  })),
  withMethods(({ _http, _toast, _router, ...store }) => ({
    addVenture: rxMethod<VentureDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post<{ data: IVenture }>('ventures', payload).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              _toast.showSuccess('Entreprise ajoutée');
              _router.navigate(['/dashboard/ventures']);
            }),
            catchError(() => {
              _toast.showError("Erreur lors de l'ajout");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
