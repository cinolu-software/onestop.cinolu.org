import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IImage } from '@shared/models/entities.models';

interface IGalleryStore {
  isLoading: boolean;
  gallery: IImage[];
}

export const GalleryStore = signalStore(
  withState<IGalleryStore>({ isLoading: false, gallery: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    loadGallery: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) => {
          return _http.get<{ data: IImage[] }>(`products/gallery/${slug}`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, gallery: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, gallery: [] });
              return of(null);
            }),
          );
        }),
      ),
    ),
    deleteImage: (id: string): void => {
      const gallery = store.gallery();
      const filtered = gallery.filter((image) => image.id !== id);
      patchState(store, { gallery: filtered });
    },
  })),
);
