import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoriesStore } from './categories.store';
import { ICategory } from '@shared/models/entities.models';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IUpdateCategoryStore {
  isLoading: boolean;
}

interface IUpdateCategoryParams {
  id: string;
  payload: ICategory;
  onSuccess: () => void;
}

export const UpdateCategoryStore = signalStore(
  withState<IUpdateCategoryStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _categoriesStore: inject(CategoriesStore),
  })),
  withMethods(({ _http, _categoriesStore, _toast, ...store }) => ({
    updateCategory: rxMethod<IUpdateCategoryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, payload, onSuccess }) => {
          return _http.patch<{ data: ICategory }>(`program-categories/${id}`, payload).pipe(
            map(({ data }) => {
              _toast.showSuccess('Catégorie mise à jour');
              _categoriesStore.updateCategory(data);
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError('Échec de la mise à jour');
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
