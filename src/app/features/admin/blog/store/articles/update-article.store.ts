import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArticleDto } from '../../dto/article.dto';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IArticle } from '@shared/models/entities.models';

interface IUpdateArticleStore {
  isLoading: boolean;
  article: IArticle | null;
}

export const UpdateArticleStore = signalStore(
  withState<IUpdateArticleStore>({ isLoading: false, article: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    updateArticle: rxMethod<ArticleDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((article) => {
          return _http.patch<{ data: IArticle }>(`articles/${article.id}`, article).pipe(
            map(({ data }) => {
              _toast.showSuccess("L'article a été mis à jour avec succès");
              _router.navigate(['/blog/articles']);
              patchState(store, { isLoading: false, article: data });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la mise à jour");
              patchState(store, { isLoading: false, article: null });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
