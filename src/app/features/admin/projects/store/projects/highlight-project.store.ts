import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@core/services/toast/toastr.service';
import { ProjectsStore } from './projects.store';
import { IProject } from '@shared/models/entities.models';

interface IHighlightStore {
  isLoading: boolean;
}

export const HighlightProjectStore = signalStore(
  withState<IHighlightStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _projectsStore: inject(ProjectsStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _projectsStore, _toast, ...store }) => ({
    highlight: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.patch<{ data: IProject }>(`projects/highlight/${id}`, {}).pipe(
            map(({ data }) => {
              _projectsStore.updateProject(data);
              _toast.showSuccess('Projet mis en avant avec succès');
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError('Erreur lors de la mise en avant du projet');
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
