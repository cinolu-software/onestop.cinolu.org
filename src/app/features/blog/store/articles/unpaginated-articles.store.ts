import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, of, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ITag } from '@shared/models/entities.models';

interface IUnpaginatedArticlesStore {
  isLoading: boolean;
  tags: ITag[];
}

export const UnpaginatedArticlesStore = signalStore(
  withState<IUnpaginatedArticlesStore>({ isLoading: false, tags: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    loadTags: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return _http.get<{ data: ITag[] }>('tags/filtered').pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, tags: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, tags: [] });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit({ loadTags }) {
      loadTags();
    },
  }),
);
