import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@core/services/toast/toastr.service';
import { ArticlesStore } from './articles.store';
import { IArticle } from '@shared/models/entities.models';

interface IHighlightStore {
  isLoading: boolean;
}

export const HighlightArticleStore = signalStore(
  withState<IHighlightStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _articlesStore: inject(ArticlesStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _articlesStore, _toast, ...store }) => ({
    highlight: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.patch<{ data: IArticle }>(`articles/highlight/${id}`, {}).pipe(
            map(({ data }) => {
              _articlesStore.updateArticle(data);
              _toast.showSuccess(
                data.is_highlighted ? "L'article a été mis en avant" : "L'article n'est plus mis en avant",
              );
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError("Erreur lors de la mise en avant de l'article");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
