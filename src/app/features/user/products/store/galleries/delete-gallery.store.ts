import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@core/services/toast/toastr.service';
import { GalleryStore } from './galeries.store';

interface IDeleteStore {
  isLoading: boolean;
}

export const DeleteGalleryStore = signalStore(
  withState<IDeleteStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _galleryStore: inject(GalleryStore),
  })),
  withMethods(({ _http, _galleryStore, _toast, ...store }) => ({
    deleteImage: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete<void>(`products/gallery/remove/${id}`).pipe(
            map(() => {
              patchState(store, { isLoading: false });
              _galleryStore.deleteImage(id);
              _toast.showSuccess('Image supprimée');
            }),
            catchError((e) => {
              console.error(e);
              patchState(store, { isLoading: false });
              _toast.showError('Échec de la suppression');
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
