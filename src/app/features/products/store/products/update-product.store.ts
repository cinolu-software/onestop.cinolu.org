import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IProduct } from '@shared/models/entities.models';
import { ProductDto } from '../../dto/product.dto';

interface IUpdateProductStore {
  isLoading: boolean;
  product: IProduct | null;
}

export const UpdateProductStore = signalStore(
  withState<IUpdateProductStore>({ isLoading: false, product: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    updateProduct: rxMethod<ProductDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((product) => {
          return _http.patch<{ data: IProduct }>(`products/${product.slug}`, product).pipe(
            map(({ data }) => {
              _toast.showSuccess('Le produit a été mis à jour avec succès');
              _router.navigate(['/dashboard/products']);
              patchState(store, { isLoading: false, product: data });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la mise à jour");
              patchState(store, { isLoading: false, product: null });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
