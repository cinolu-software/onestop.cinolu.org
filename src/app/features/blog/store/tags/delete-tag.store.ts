import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TagsStore } from './tag.store';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IDeleteTagStore {
  isLoading: boolean;
}

interface IDeleteTagParams {
  id: string;
}

export const DeleteTagStore = signalStore(
  withState<IDeleteTagStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _tagsStore: inject(TagsStore),
  })),
  withMethods(({ _http, _tagsStore, _toast, ...store }) => ({
    deleteTag: rxMethod<IDeleteTagParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id }) => {
          return _http.delete<void>(`tags/${id}`).pipe(
            map(() => {
              patchState(store, { isLoading: false });
              _tagsStore.deleteTag(id);
              _toast.showSuccess('Tag supprimée avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Échec de la suppression du tag');
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
