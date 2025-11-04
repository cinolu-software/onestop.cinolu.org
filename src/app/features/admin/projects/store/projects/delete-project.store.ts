import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProjectsStore } from './projects.store';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IProject } from '@shared/models/entities.models';

interface IDeleteProjectStore {
  isLoading: boolean;
}

export const DeleteProjectStore = signalStore(
  withState<IDeleteProjectStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _projectsStore: inject(ProjectsStore),
  })),
  withMethods(({ _http, _projectsStore, _toast, ...store }) => ({
    deleteProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete<{ data: IProject }>(`projects/${id}`).pipe(
            tap(() => {
              _projectsStore.deleteProject(id);
              _toast.showSuccess('Le projet a été supprimé avec succès');
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la suppression");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
