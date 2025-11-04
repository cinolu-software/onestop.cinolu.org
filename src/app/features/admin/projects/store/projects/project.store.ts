import { signalStore, withState, withMethods, patchState, withProps } from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { IndicatorsStore } from '../../../programs/store/indicators/indicators.store';
import { IProject } from '@shared/models';

interface IProjectStore {
  isLoading: boolean;
  project: IProject | null;
}

export const ProjectStore = signalStore(
  withState<IProjectStore>({ isLoading: false, project: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _indicatorsStore: inject(IndicatorsStore)
  })),
  withMethods(({ _http, _indicatorsStore, ...store }) => ({
    loadProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) => {
          return _http.get<{ data: IProject }>(`projects/slug/${slug}`).pipe(
            tap(({ data }) => {
              _indicatorsStore.loadIndicators({
                programId: data.program.program.id,
                year: new Date(data.started_at).getFullYear()
              });
              patchState(store, { isLoading: false, project: data });
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
