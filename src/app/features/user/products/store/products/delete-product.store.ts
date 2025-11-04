import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IProduct } from '@shared/models/entities.models';
import { ProductsStore } from './products.store';

interface IDeleteProductStore {
  isLoading: boolean;
}

export const DeleteProductStore = signalStore(
  withState<IDeleteProductStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _productsStore: inject(ProductsStore),
  })),
  withMethods(({ _http, _toast, _productsStore, ...store }) => ({
    deleteProduct: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete<{ data: IProduct }>(`products/${id}`).pipe(
            tap(() => {
              _productsStore.deleteProduct(id);
              _toast.showSuccess('Le produit a été supprimé');
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
