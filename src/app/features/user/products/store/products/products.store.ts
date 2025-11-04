import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, switchMap } from 'rxjs';
import { FilterProductsDto } from '../../dto/filter-product.dto';
import { buildQueryParams } from '@shared/helpers';
import { IProduct } from '@shared/models/entities.models';

interface IProductsStore {
  isLoading: boolean;
  products: [IProduct[], number];
}

export const ProductsStore = signalStore(
  withState<IProductsStore>({ isLoading: false, products: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadProducts: rxMethod<FilterProductsDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IProduct[], number] }>('products/by-user', { params }).pipe(
            tap(({ data }) => patchState(store, { isLoading: false, products: data })),
            catchError(() => {
              patchState(store, { isLoading: false, products: [[], 0] });
              return of([]);
            })
          );
        })
      )
    ),
    deleteProduct: (id: string) => {
      const [products, total] = store.products();
      const updatedProducts = products.filter((product) => product.id !== id);
      patchState(store, { products: [updatedProducts, total - 1] });
    }
  }))
);
