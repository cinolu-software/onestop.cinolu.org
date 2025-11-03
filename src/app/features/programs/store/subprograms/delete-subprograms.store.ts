import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SubprogramsStore } from './subprograms.store';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IDeleteSubprogramStore {
  isLoading: boolean;
}

export const DeleteSubprogramsStore = signalStore(
  withState<IDeleteSubprogramStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _programsStore: inject(SubprogramsStore),
  })),
  withMethods(({ _http, _programsStore, _toast, ...store }) => ({
    deleteProgram: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete<void>(`subprograms/${id}`).pipe(
            map(() => {
              patchState(store, { isLoading: false });
              _programsStore.deleteProgram(id);
              _toast.showSuccess('Programme supprimé');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Échec de la suppression');
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
