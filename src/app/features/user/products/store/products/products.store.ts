import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, switchMap, map } from 'rxjs';
import { FilterProductsDto } from '../../dto/filter-product.dto';
import { buildQueryParams } from '@shared/helpers';
import { IImage, IProduct } from '@shared/models/entities.models';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { ProductDto } from '../../dto/product.dto';

interface IProductsStore {
  isLoading: boolean;
  products: [IProduct[], number];
  product: IProduct | null;
  gallery: IImage[];
}

export const ProductsStore = signalStore(
  withState<IProductsStore>({ isLoading: false, products: [[], 0], product: null, gallery: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
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
    // Single
    loadProduct: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.get<{ data: IProduct }>(`products/${id}`).pipe(
            map(({ data }) => patchState(store, { isLoading: false, product: data })),
            catchError(() => {
              patchState(store, { isLoading: false, product: null });
              return of(null);
            })
          )
        )
      )
    ),

    // Create / Update / Delete
    addProduct: rxMethod<ProductDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) =>
          _http.post<{ data: IProduct }>('products', payload).pipe(
            map(({ data }) => {
              _toast.showSuccess('Produit ajouté');
              _router.navigate(['/products']);
              patchState(store, { isLoading: false, product: data });
            }),
            catchError(() => {
              _toast.showError("Erreur lors de l'ajout");
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),
    updateProduct: rxMethod<ProductDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) =>
          _http.patch<{ data: IProduct }>(`products/${payload.slug}`, payload).pipe(
            map(({ data }) => {
              _toast.showSuccess('Le produit a été mis à jour avec succès');
              _router.navigate(['/products']);
              const [list, count] = store.products();
              const updated = list.map((p) => (p.id === data.id ? data : p));
              patchState(store, { isLoading: false, product: data, products: [updated, count] });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la mise à jour");
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),
    deleteProduct: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.delete<void>(`products/${id}`).pipe(
            map(() => {
              const [products, total] = store.products();
              const updatedProducts = products.filter((product) => product.id !== id);
              _toast.showSuccess('Le produit a été supprimé');
              patchState(store, { isLoading: false, products: [updatedProducts, Math.max(0, total - 1)] });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la suppression");
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),

    // Gallery
    loadGallery: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) =>
          _http.get<{ data: IImage[] }>(`products/gallery/${slug}`).pipe(
            map(({ data }) => patchState(store, { isLoading: false, gallery: data })),
            catchError(() => {
              patchState(store, { isLoading: false, gallery: [] });
              return of(null);
            })
          )
        )
      )
    ),
    deleteImage: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.delete<void>(`products/gallery/remove/${id}`).pipe(
            map(() => {
              const current = store.gallery();
              const filtered = current.filter((img) => img.id !== id);
              _toast.showSuccess('Image supprimée');
              patchState(store, { isLoading: false, gallery: filtered });
            }),
            catchError(() => {
              _toast.showError('Échec de la suppression');
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    )
  }))
);
