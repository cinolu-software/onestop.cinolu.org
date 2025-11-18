import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { IImage } from '@shared/models/entities.models';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IVentureGalleryStore {
  isLoading: boolean;
  gallery: IImage[];
}

export const VentureGalleryStore = signalStore(
  withState<IVentureGalleryStore>({
    isLoading: false,
    gallery: []
  }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _toast, ...store }) => ({
    loadGallery: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) =>
          _http.get<{ data: IImage[] }>(`ventures/gallery/${slug}`).pipe(
            map(({ data }) => patchState(store, { isLoading: false, gallery: data })),
            catchError(() => {
              patchState(store, { isLoading: false, gallery: [] });
              return of(null);
            })
          )
        )
      )
    ),
    deleteImage: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.delete<void>(`ventures/gallery/remove/${id}`).pipe(
            map(() => {
              const current = store.gallery();
              const filtered = current.filter((img) => img.id !== id);
              _toast.showSuccess('Image supprimée avec succès');
              patchState(store, { isLoading: false, gallery: filtered });
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError("Échec de la suppression de l'image");
              return of(null);
            })
          )
        )
      )
    )
  }))
);
