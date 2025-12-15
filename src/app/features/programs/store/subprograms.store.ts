import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@shared/services/toast/toastr.service';
import { FilterSubprogramsDto } from '../dto/subprograms/filter-subprograms.dto';
import { SubprogramDto } from '../dto/subprograms/subprograms.dto';
import { buildQueryParams } from '@shared/helpers';
import { ISubprogram } from '@shared/models';

interface IProgramsStore {
  isLoading: boolean;
  subprograms: [ISubprogram[], number];
  allSubprograms: ISubprogram[];
}

export const SubprogramsStore = signalStore(
  withState<IProgramsStore>({ isLoading: false, subprograms: [[], 0], allSubprograms: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _toast, ...store }) => ({
    loadPrograms: rxMethod<{ id: string; payload: FilterSubprogramsDto }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((params) => {
          const p = buildQueryParams(params.payload);
          return _http
            .get<{ data: [ISubprogram[], number] }>(`subprograms/paginated/${params.id}`, {
              params: p
            })
            .pipe(
              map(({ data }) => {
                patchState(store, { isLoading: false, subprograms: data });
              }),
              catchError(() => {
                patchState(store, { isLoading: false, subprograms: [[], 0] });
                return of(null);
              })
            );
        })
      )
    ),
    addSubprogram: rxMethod<{ payload: SubprogramDto; onSuccess: () => void }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) => {
          return _http.post<{ data: ISubprogram }>('subprograms', payload).pipe(
            map(({ data }) => {
              const [list, count] = store.subprograms();
              patchState(store, { subprograms: [[data, ...list], count + 1] });
              _toast.showSuccess('Sous programme ajouté');
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError("Échec de l'ajout du sous programme");
              patchState(store, { isLoading: false });
              return of(null);
            })
          );
        })
      )
    ),
    updateSubprogram: rxMethod<{ payload: SubprogramDto; onSuccess: () => void }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) =>
          _http.patch<{ data: ISubprogram }>(`subprograms/${payload.id}`, payload).pipe(
            map(({ data }) => {
              const [list, count] = store.subprograms();
              const updated = list.map((sp) => (sp.id === data.id ? data : sp));
              patchState(store, { subprograms: [updated, count] });
              _toast.showSuccess('Sous programme mis à jour');
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError('Échec de la mise à jour');
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),
    deleteSubprogram: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.delete<void>(`subprograms/${id}`).pipe(
            map(() => {
              patchState(store, { isLoading: false });
              const [list, count] = store.subprograms();
              const filtered = list.filter((subprogram) => subprogram.id !== id);
              const filteredUnpaginated = store.allSubprograms().filter((subprogram) => subprogram.id !== id);
              patchState(store, {
                subprograms: [filtered, count - 1],
                allSubprograms: filteredUnpaginated
              });
              _toast.showSuccess('Programme supprimé');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Échec de la suppression');
              return of(null);
            })
          )
        )
      )
    ),
    publishSubprogram: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.post<{ data: ISubprogram }>(`subprograms/publish/${id}`, {}).pipe(
            map(({ data }) => {
              const [list, count] = store.subprograms();
              const updated = list.map((sp) => (sp.id === data.id ? data : sp));
              const updatedUnpaginated = store.allSubprograms().map((sp) => (sp.id === data.id ? data : sp));
              patchState(store, {
                subprograms: [updated, count],
                allSubprograms: updatedUnpaginated
              });
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),
    highlightSubprogram: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.patch<{ data: ISubprogram }>(`subprograms/highlight/${id}`, {}).pipe(
            map(({ data }) => {
              const [list, count] = store.subprograms();
              const updated = list.map((sp) => (sp.id === data.id ? data : sp));
              const updatedUnpaginated = store.allSubprograms().map((sp) => (sp.id === data.id ? data : sp));
              patchState(store, {
                subprograms: [updated, count],
                allSubprograms: updatedUnpaginated
              });
              _toast.showSuccess(
                data.is_highlighted ? 'Programme mis en avant' : 'Programme retiré de la mise en avant'
              );
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError('Erreur lors de la mise en avant du programme');
              patchState(store, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),
    loadAllSubprograms: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() =>
          _http.get<{ data: ISubprogram[] }>(`subprograms`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, allSubprograms: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, allSubprograms: [] });
              return of(null);
            })
          )
        )
      )
    ),
    loadallSubprograms: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _http.get<{ data: ISubprogram[] }>(`subprograms/unpaginated/${id}`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, allSubprograms: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, allSubprograms: [] });
              return of(null);
            })
          )
        )
      )
    )
  }))
);
