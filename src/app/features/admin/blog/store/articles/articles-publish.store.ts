import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FilterArticlesDto } from '../../dto/filter-articles.dto';
import { IArticle } from '@shared/models';
import { buildQueryParams } from '@shared/helpers';


interface IArticlesStore {
  isLoading: boolean;
  articles: [IArticle[], number];
}

export const ArticlesPublishStore = signalStore(
  withState<IArticlesStore>({ isLoading: false, articles: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadArticles: rxMethod<FilterArticlesDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http
            .get<{
              data: [IArticle[], number];
            }>('articles/find-published', { params })
            .pipe(
              tap(({ data }) => patchState(store, { isLoading: false, articles: data })),
              catchError(() => {
                patchState(store, { isLoading: false, articles: [[], 0] });
                return of(null);
              })
            );
        })
      )
    )
  }))
);
