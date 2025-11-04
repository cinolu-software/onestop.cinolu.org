import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, of, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICategory } from '@shared/models/entities.models';

interface IUnpaginatedCategoriesStore {
  isLoading: boolean;
  categories: ICategory[];
}

export const UnpaginatedCategoriesStore = signalStore(
  withState<IUnpaginatedCategoriesStore>({ isLoading: false, categories: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    loadCategories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return _http.get<{ data: ICategory[] }>('program-categories').pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false, categories: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, categories: [] });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit({ loadCategories }) {
      loadCategories();
    },
  }),
);
