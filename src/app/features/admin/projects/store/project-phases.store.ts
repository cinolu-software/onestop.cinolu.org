import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IPhase } from '@shared/models/entities.models';

interface IPhaseDto {
  name: string;
  description?: string;
  order?: number;
  started_at?: Date;
  ended_at?: Date;
  is_active?: boolean;
  project: string;
}

interface IPhasesStore {
  isLoading: boolean;
  phases: IPhase[];
  selectedPhase: IPhase | null;
}

export const ProjectPhasesStore = signalStore(
  withState<IPhasesStore>({
    isLoading: false,
    phases: [],
    selectedPhase: null
  }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _toast, ...store }) => ({
    loadPhasesByProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((projectId) => {
          return _http.get<{ data: IPhase[] }>(`phases/project/${projectId}`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, phases: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, phases: [] });
              _toast.showError('Erreur lors du chargement des phases');
              return of(null);
            })
          );
        })
      )
    ),
    loadPhase: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((phaseId) => {
          return _http.get<{ data: IPhase }>(`phases/${phaseId}`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, selectedPhase: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors du chargement de la phase');
              return of(null);
            })
          );
        })
      )
    ),
    createPhase: rxMethod<IPhaseDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((phaseDto) => {
          return _http.post<{ data: IPhase }>('phases', phaseDto).pipe(
            map(({ data }) => {
              const currentPhases = store.phases();
              patchState(store, {
                isLoading: false,
                phases: [...currentPhases, data]
              });
              _toast.showSuccess('Phase créée avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la création de la phase');
              return of(null);
            })
          );
        })
      )
    ),
    updatePhase: rxMethod<{ id: string; data: Partial<IPhaseDto> }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, data }) => {
          return _http.patch<{ data: IPhase }>(`phases/${id}`, data).pipe(
            map(({ data: updatedPhase }) => {
              const currentPhases = store.phases();
              const updatedPhases = currentPhases.map((phase) => (phase.id === id ? updatedPhase : phase));
              patchState(store, {
                isLoading: false,
                phases: updatedPhases
              });
              _toast.showSuccess('Phase mise à jour avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la mise à jour de la phase');
              return of(null);
            })
          );
        })
      )
    ),
    deletePhase: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((phaseId) => {
          return _http.delete(`phases/${phaseId}`).pipe(
            map(() => {
              const currentPhases = store.phases();
              const filteredPhases = currentPhases.filter((phase) => phase.id !== phaseId);
              patchState(store, {
                isLoading: false,
                phases: filteredPhases
              });
              _toast.showSuccess('Phase supprimée avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la suppression de la phase');
              return of(null);
            })
          );
        })
      )
    ),
    getPhaseRating: rxMethod<{ phaseId: string; projectId: string }>(
      pipe(
        switchMap(({ phaseId, projectId }) => {
          return _http
            .get<{ data: { average: number; passed: boolean } }>(`phases/${phaseId}/project/${projectId}/rating`)
            .pipe(
              catchError(() => {
                return of(null);
              })
            );
        })
      )
    ),
    selectPhase(phase: IPhase | null) {
      patchState(store, { selectedPhase: phase });
    }
  }))
);
