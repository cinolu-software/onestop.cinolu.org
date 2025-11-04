import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoriesStore } from './categories.store';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IDeleteCategoryStore {
  isLoading: boolean;
}

export const DeleteCategoryStore = signalStore(
  withState<IDeleteCategoryStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _categoriesStore: inject(CategoriesStore),
  })),
  withMethods(({ _http, _categoriesStore, _toast, ...store }) => ({
    deleteCategory: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete<void>(`program-categories/${id}`).pipe(
            map(() => {
              patchState(store, { isLoading: false });
              _categoriesStore.deleteCategory(id);
              _toast.showSuccess('Catégorie supprimée avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Échec de la suppression de la catégorie');
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
