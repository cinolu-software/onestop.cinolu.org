import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IVenture } from '@shared/models/entities.models';
import { ProductDto } from '../../dto/product.dto';

interface IAddProductStore {
  isLoading: boolean;
}

export const AddProductStore = signalStore(
  withState<IAddProductStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router)
  })),
  withMethods(({ _http, _toast, _router, ...store }) => ({
    addProduct: rxMethod<ProductDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post<{ data: IVenture }>('products', payload).pipe(
            tap(() => {
              patchState(store, { isLoading: false });
              _toast.showSuccess('Produit ajouté');
              _router.navigate(['/products']);
            }),
            catchError(() => {
              _toast.showError("Erreur lors de l'ajout");
              patchState(store, { isLoading: false });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
