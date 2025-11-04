import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { IImage } from '@shared/models';

interface IGalleryStore {
  isLoading: boolean;
  gallery: IImage[];
}

export const GalleryProductStore = signalStore(
  withState<IGalleryStore>({ isLoading: false, gallery: [] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadGallery: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) => {
          return _http.get<{ data: IImage[] }>(`products/gallery/${slug}`).pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false, gallery: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
