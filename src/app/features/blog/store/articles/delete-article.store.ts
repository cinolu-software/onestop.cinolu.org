import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArticlesStore } from './articles.store';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IArticle } from '@shared/models/entities.models';

interface IDeleteArticleStore {
  isLoading: boolean;
}

export const DeleteArticleStore = signalStore(
  withState<IDeleteArticleStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _articlesStore: inject(ArticlesStore),
  })),
  withMethods(({ _http, _articlesStore, _toast, ...store }) => ({
    deleteArticle: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete<{ data: IArticle }>(`articles/${id}`).pipe(
            tap(() => {
              _articlesStore.deleteAricle(id);
              _toast.showSuccess("L'article a été supprimé avec succès");
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la suppression");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
