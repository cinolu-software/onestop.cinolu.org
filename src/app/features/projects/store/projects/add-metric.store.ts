import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProject } from '@shared/models';
import { ToastrService } from '@core/services/toast';

interface IAddMetricStore {
  isLoading: boolean;
  project: IProject | null;
}

interface AddMetricDto {
  indicatorId: string;
  target?: number;
  achieved?: number;
}

interface AddMetricsParams {
  id: string;
  metrics: AddMetricDto[];
}

export const AddMetricStore = signalStore(
  withState<IAddMetricStore>({ isLoading: false, project: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _toast, ...store }) => ({
    addMetrics: rxMethod<AddMetricsParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((params) => {
          return _http.post<{ data: IProject }>(`projects/metrics/${params.id}`, params.metrics).pipe(
            map(({ data }) => {
              _toast.showSuccess('Les métriques ont été ajoutées');
              patchState(store, { isLoading: false, project: data });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite");
              patchState(store, { isLoading: false, project: null });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
