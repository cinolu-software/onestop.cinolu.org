import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterArticlesTagsDto } from '../../dto/filter-tags.dto';
import { buildQueryParams } from '@shared/helpers';
import { IArticle } from '@shared/models';

interface IArticlesStore {
  isLoading: boolean;
  articles: [IArticle[], number];
}

export const ArticlesStore = signalStore(
  withState<IArticlesStore>({ isLoading: false, articles: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadArticles: rxMethod<FilterArticlesTagsDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IArticle[], number] }>('articles', { params }).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, articles: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, articles: [[], 0] });
              return of(null);
            })
          );
        })
      )
    ),
    updateArticle: (article: IArticle): void => {
      const [articles, count] = store.articles();
      const updated = articles.map((e) => (e.id === article.id ? article : e));
      patchState(store, { articles: [updated, count] });
    },
    deleteAricle: (id: string): void => {
      const [articles, count] = store.articles();
      const filtered = articles.filter((article) => article.id !== id);
      patchState(store, { articles: [filtered, count - 1] });
    }
  }))
);
