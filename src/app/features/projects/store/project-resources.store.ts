import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@shared/services/toast/toastr.service';
import { IResource, ResourceType } from '@shared/models';

interface ICreateResourceDto {
  title?: string;
  type: ResourceType;
  url: string;
  phase?: string;
  project?: string;
}

interface IResourcesStore {
  isLoading: boolean;
  resources: IResource[];
}

export const ProjectResourcesStore = signalStore(
  withState<IResourcesStore>({
    isLoading: false,
    resources: []
  }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _toast, ...store }) => ({
    // Load resources by phase ID
    loadResourcesByPhase: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((phaseId) => {
          return _http.get<{ data: IResource[] }>(`resources/phase/${phaseId}`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, resources: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, resources: [] });
              _toast.showError('Erreur lors du chargement des ressources');
              return of(null);
            })
          );
        })
      )
    ),

    // Load resources by project ID
    loadResourcesByProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((projectId) => {
          return _http.get<{ data: IResource[] }>(`resources/project/${projectId}`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, resources: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, resources: [] });
              _toast.showError('Erreur lors du chargement des ressources');
              return of(null);
            })
          );
        })
      )
    ),

    // Create resource with URL
    createResource: rxMethod<ICreateResourceDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((resourceDto) => {
          return _http.post<{ data: IResource }>('resources', resourceDto).pipe(
            map(({ data }) => {
              const currentResources = store.resources();
              patchState(store, {
                isLoading: false,
                resources: [...currentResources, data]
              });
              _toast.showSuccess('Ressource créée avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la création de la ressource');
              return of(null);
            })
          );
        })
      )
    ),

    // Upload file and create resource
    uploadResource: rxMethod<{ file: File; title: string; phase?: string; project?: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ file, title, phase, project }) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('title', title);
          if (phase) formData.append('phase', phase);
          if (project) formData.append('project', project);

          return _http.post<{ data: IResource }>('resources/upload', formData).pipe(
            map(({ data }) => {
              const currentResources = store.resources();
              patchState(store, {
                isLoading: false,
                resources: [...currentResources, data]
              });
              _toast.showSuccess('Fichier téléchargé avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors du téléchargement du fichier');
              return of(null);
            })
          );
        })
      )
    ),

    // Update resource
    updateResource: rxMethod<{ id: string; data: Partial<ICreateResourceDto> }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, data }) => {
          return _http.patch<{ data: IResource }>(`resources/${id}`, data).pipe(
            map(({ data: updatedResource }) => {
              const currentResources = store.resources();
              const updatedResources = currentResources.map((resource) =>
                resource.id === id ? updatedResource : resource
              );
              patchState(store, {
                isLoading: false,
                resources: updatedResources
              });
              _toast.showSuccess('Ressource mise à jour avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la mise à jour de la ressource');
              return of(null);
            })
          );
        })
      )
    ),

    // Delete resource
    deleteResource: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((resourceId) => {
          return _http.delete(`resources/${resourceId}`).pipe(
            map(() => {
              const currentResources = store.resources();
              const filteredResources = currentResources.filter(
                (resource) => resource.id !== resourceId
              );
              patchState(store, {
                isLoading: false,
                resources: filteredResources
              });
              _toast.showSuccess('Ressource supprimée avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la suppression de la ressource');
              return of(null);
            })
          );
        })
      )
    )
  }))
);
