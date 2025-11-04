import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { buildQueryParams } from '@shared/helpers';
import { ICategory } from '@shared/models/entities.models';
import { FilterProjectCategoriesDto } from '../../dto/categories/filter-categories.dto';

interface ICategoriesStore {
  isLoading: boolean;
  categories: [ICategory[], number];
}

export const CategoriesStore = signalStore(
  withState<ICategoriesStore>({ isLoading: false, categories: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadCategories: rxMethod<FilterProjectCategoriesDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http
            .get<{
              data: [ICategory[], number];
            }>('project-categories/paginated', { params })
            .pipe(
              map(({ data }) => {
                patchState(store, { isLoading: false, categories: data });
              }),
              catchError(() => {
                patchState(store, { isLoading: false, categories: [[], 0] });
                return of(null);
              })
            );
        })
      )
    ),
    addCategory: (category: ICategory): void => {
      const [categories, count] = store.categories();
      patchState(store, { categories: [[category, ...categories], count + 1] });
    },
    updateCategory: (category: ICategory): void => {
      const [categories, count] = store.categories();
      const updated = categories.map((c) => (c.id === category.id ? category : c));
      patchState(store, { categories: [updated, count] });
    },
    deleteCategory: (id: string): void => {
      const [categories, count] = store.categories();
      const filtered = categories.filter((category) => category.id !== id);
      patchState(store, { categories: [filtered, count - 1] });
    }
  }))
);
