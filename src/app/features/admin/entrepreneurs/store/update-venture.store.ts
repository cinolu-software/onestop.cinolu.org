import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { VentureDto } from '@features/ventures/dto/venture.dto';
import { IVenture } from '@shared/models';
import { ToastrService } from '@core/services/toast';

interface IUpdateVenturetore {
  isLoading: boolean;
}

export const UpdateVenturetore = signalStore(
  withState<IUpdateVenturetore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router)
  })),
  withMethods(({ _http, _toast, _router, ...store }) => ({
    updateVenture: rxMethod<{ slug: string; payload: VentureDto }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((params) => {
          return _http
            .patch<{
              data: IVenture;
            }>(`ventures/${params.slug}`, params.payload)
            .pipe(
              tap(() => {
                patchState(store, { isLoading: false });
                _toast.showSuccess('Entreprise mise à jour');
                _router.navigate(['/dashboard/entrepreneurs/ventures']);
              }),
              catchError(() => {
                patchState(store, { isLoading: false });
                _toast.showError('Erreur lors de la mise à jour');
                return of(null);
              })
            );
        })
      )
    )
  }))
);
