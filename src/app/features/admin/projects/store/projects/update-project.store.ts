import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IProject } from '@shared/models/entities.models';
import { ProjectDto } from '../../dto/projects/project.dto';

interface IUpdateProjectStore {
  isLoading: boolean;
  project: IProject | null;
}

export const UpdateProjectStore = signalStore(
  withState<IUpdateProjectStore>({ isLoading: false, project: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _router, _toast, ...store }) => ({
    updateProject: rxMethod<ProjectDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((project) => {
          return _http.patch<{ data: IProject }>(`projects/${project.id}`, project).pipe(
            map(({ data }) => {
              _toast.showSuccess('Le projet a été mis à jour avec succès');
              _router.navigate(['/projects']);
              patchState(store, { isLoading: false, project: data });
            }),
            catchError(() => {
              _toast.showError("Une erreur s'est produite lors de la mise à jour");
              patchState(store, { isLoading: false, project: null });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
