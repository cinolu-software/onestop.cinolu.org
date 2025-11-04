import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TagsStore } from './tag.store';
import { ToastrService } from '@core/services/toast/toastr.service';
import { ITag } from '@shared/models/entities.models';

interface IUpdateTagStore {
  isLoading: boolean;
}

interface IUpdateTagParams {
  id: string;
  payload: ITag;
  onSuccess: () => void;
}

export const UpdateTagStore = signalStore(
  withState<IUpdateTagStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _tagsStore: inject(TagsStore),
  })),
  withMethods(({ _http, _tagsStore, _toast, ...store }) => ({
    updateTag: rxMethod<IUpdateTagParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, payload, onSuccess }) => {
          return _http.patch<{ data: ITag }>(`tags/${id}`, payload).pipe(
            map(({ data }) => {
              _toast.showSuccess('Tag mise à jour');
              _tagsStore.updateTag(data);
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError('Échec de la mise à jour');
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
