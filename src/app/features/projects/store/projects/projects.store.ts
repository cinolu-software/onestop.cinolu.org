import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProject } from '@shared/models/entities.models';
import { buildQueryParams } from '@shared/helpers';
import { FilterProjectCategoriesDto } from '../../dto/categories/filter-categories.dto';

interface IProjectsStore {
  isLoading: boolean;
  projects: [IProject[], number];
}

export const ProjectsStore = signalStore(
  withState<IProjectsStore>({ isLoading: false, projects: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadProjects: rxMethod<FilterProjectCategoriesDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IProject[], number] }>('projects', { params }).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, projects: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, projects: [[], 0] });
              return of(null);
            })
          );
        })
      )
    ),
    updateProject: (project: IProject): void => {
      const [projects, count] = store.projects();
      const updated = projects.map((p) => (p.id === project.id ? project : p));
      patchState(store, { projects: [updated, count] });
    },
    deleteProject: (id: string): void => {
      const [projects, count] = store.projects();
      const filtered = projects.filter((project) => project.id !== id);
      patchState(store, { projects: [filtered, count - 1] });
    }
  }))
);
