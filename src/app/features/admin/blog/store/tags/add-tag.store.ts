import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TagsStore } from './tag.store';
import { ArticleTagDto } from '../../dto/article-tag.dto';
import { ToastrService } from '@core/services/toast/toastr.service';
import { ITag } from '@shared/models/entities.models';

interface IAddTagStore {
  isLoading: boolean;
}

interface IAddTagParams {
  payload: ArticleTagDto;
  onSuccess: () => void;
}

export const AddTagStore = signalStore(
  withState<IAddTagStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _tagsStore: inject(TagsStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _tagsStore, _toast, ...store }) => ({
    addTag: rxMethod<IAddTagParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) => {
          return _http.post<{ data: ITag }>('tags', payload).pipe(
            map(({ data }) => {
              _tagsStore.addTag(data);
              _toast.showSuccess('Tag ajoutée avec succès');
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError("Échec de l'ajout du tag");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
