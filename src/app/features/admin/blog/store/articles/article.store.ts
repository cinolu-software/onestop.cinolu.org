import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IArticle } from '@shared/models';

interface IArticlesStore {
  isLoading: boolean;
  article: IArticle | null;
}

export const ArticleStore = signalStore(
  withState<IArticlesStore>({ isLoading: false, article: null }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadArticle: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) => {
          return _http.get<{ data: IArticle }>(`articles/slug/${slug}`).pipe(
            tap(({ data }) => patchState(store, { isLoading: false, article: data })),
            catchError(() => {
              patchState(store, { isLoading: false });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
