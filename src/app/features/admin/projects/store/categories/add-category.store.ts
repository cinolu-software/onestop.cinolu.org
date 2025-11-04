import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoriesStore } from './categories.store';
import { ToastrService } from '@core/services/toast/toastr.service';
import { ICategory } from '@shared/models/entities.models';
import { ProjectCategoryDto } from '../../dto/categories/event-category.dto';

interface IAddCategoryStore {
  isLoading: boolean;
}

interface IAddCategoryParams {
  payload: ProjectCategoryDto;
  onSuccess: () => void;
}

export const AddCategoryStore = signalStore(
  withState<IAddCategoryStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _categoriesStore: inject(CategoriesStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _categoriesStore, _toast, ...store }) => ({
    addCategory: rxMethod<IAddCategoryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) => {
          return _http.post<{ data: ICategory }>('project-categories', payload).pipe(
            map(({ data }) => {
              _categoriesStore.addCategory(data);
              _toast.showSuccess('Catégorie ajoutée avec succès');
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError("Échec de l'ajout de la catégorie");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
