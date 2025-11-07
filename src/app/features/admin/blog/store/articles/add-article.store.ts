import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArticleDto } from '../../dto/article.dto';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IArticle } from '@shared/models/entities.models';

interface IAddArticleStore {
  isLoading: boolean;
  articles: IArticle | null;
}

export const AddArticleStore = signalStore(
  withState<IAddArticleStore>({ isLoading: false, articles: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    addArticle: rxMethod<ArticleDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((article) => {
          return _http.post<{ data: IArticle }>('articles', article).pipe(
            map(({ data }) => {
              _toast.showSuccess("L'article a été ajouté avec succès");
              _router.navigate(['/blog/articles']);
              patchState(store, { isLoading: false, articles: data });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de l'ajout");
              patchState(store, { isLoading: false, articles: null });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
