import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, switchMap } from 'rxjs';
import { IProduct } from '@shared/models/entities.models';

interface IProductStore {
  isLoading: boolean;
  product: IProduct | null;
}

export const ProductStore = signalStore(
  withState<IProductStore>({ isLoading: false, product: null }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    loadProduct: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.get<{ data: IProduct }>(`products/${id}`).pipe(
            tap(({ data }) => patchState(store, { isLoading: false, product: data })),
            catchError(() => {
              patchState(store, { isLoading: false, product: null });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
