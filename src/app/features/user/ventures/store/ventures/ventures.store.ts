import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, switchMap, map } from 'rxjs';
import { FilterVenturesDto } from '../../dto/filter-venture.dto';
import { buildQueryParams } from '@shared/helpers';
import { IImage, IVenture } from '@shared/models/entities.models';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { VentureDto } from '../../dto/venture.dto';

interface IVenturesStore {
  isLoading: boolean;
  ventures: [IVenture[], number];
  venture: IVenture | null;
  gallery: IImage[];
}

export const VenturesStore = signalStore(
  withState<IVenturesStore>({ isLoading: false, ventures: [[], 0], venture: null, gallery: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    loadVentures: rxMethod<FilterVenturesDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IVenture[], number] }>('ventures/by-user/paginated', { params }).pipe(
            tap(({ data }) => patchState(store, { isLoading: false, ventures: data })),
            catchError(() => {
              patchState(store, { isLoading: false, ventures: [[], 0] });
              return of([]);
            })
          );
        })
      )
    ),
    // Single
    loadVenture: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) =>
          _http.get<{ data: IVenture }>(`ventures/by-slug/${slug}`).pipe(
            map(({ data }) => patchState(store, { isLoading: false, venture: data })),
            catchError(() => {
              patchState(store, { isLoading: false, venture: null });
              return of(null);
            })
          )
        )
      )
    ),

    // Create / Update / Delete
    addVenture: rxMethod<VentureDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) =>
          _http.post<{ data: IVenture }>('ventures', payload).pipe(
            map(({ data }) => {
              _toast.showSuccess('Entreprise ajoutée');
              _router.navigate(['/ventures']);
              patchState(store, { isLoading: false, venture: data });
            }),
            catchError(() => {
              _toast.showError("Erreur lors de l'ajout");
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),
    updateVenture: rxMethod<{ slug: string; payload: VentureDto }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ slug, payload }) =>
          _http.patch<{ data: IVenture }>(`ventures/${slug}`, payload).pipe(
            map(({ data }) => {
              _toast.showSuccess('Entreprise mise à jour');
              _router.navigate(['/ventures']);
              const [list, count] = store.ventures();
              const updated = list.map((v) => (v.id === data.id ? data : v));
              patchState(store, { isLoading: false, venture: data, ventures: [updated, count] });
            }),
            catchError(() => {
              _toast.showError('Erreur lors de la mise à jour');
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),
    deleteVenture: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.delete<void>(`ventures/${id}`).pipe(
            map(() => {
              const [ventures, total] = store.ventures();
              const updatedVentures = ventures.filter((venture) => venture.id !== id);
              _toast.showSuccess('Entreprise supprimée');
              patchState(store, { isLoading: false, ventures: [updatedVentures, Math.max(0, total - 1)] });
            }),
            catchError(() => {
              _toast.showError('Erreur lors de la suppression');
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),

    // Gallery
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
