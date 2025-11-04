import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProgramsStore } from './programs.store';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IDeleteProgramStore {
  isLoading: boolean;
}

interface IDeleteProgramParams {
  id: string;
}

export const DeleteProgramStore = signalStore(
  withState<IDeleteProgramStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _programsStore: inject(ProgramsStore),
  })),
  withMethods(({ _http, _programsStore, _toast, ...store }) => ({
    deleteProgram: rxMethod<IDeleteProgramParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id }) => {
          return _http.delete<void>(`programs/${id}`).pipe(
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
