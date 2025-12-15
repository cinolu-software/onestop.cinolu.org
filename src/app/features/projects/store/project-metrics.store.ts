import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@shared/services/toast/toastr.service';
import { IProject } from '@shared/models';

interface AddMetricDto {
  indicatorId: string;
  target?: number;
  achieved?: number;
}

interface AddMetricsParams {
  id: string;
  metrics: AddMetricDto[];
}

interface IProjectMetricsState {
  isLoading: boolean;
}

export const ProjectMetricsStore = signalStore(
  withState<IProjectMetricsState>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _toast, ...store }) => ({
    create: rxMethod<AddMetricsParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((params) =>
          _http.post<{ data: IProject }>(`projects/metrics/${params.id}`, params.metrics).pipe(
            map(() => {
              _toast.showSuccess('Les métriques ont été ajoutées');
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite");
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    )
  }))
);
