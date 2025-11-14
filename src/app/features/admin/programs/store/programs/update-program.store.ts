import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProgramDto } from '../../dto/programs/program.dto';
import { IProgram } from '@shared/models';
import { ToastrService } from '@core/services/toast';
import { Router } from '@angular/router';

interface IUpdateProgramStore {
  isLoading: boolean;
}

interface IUpdateProgramParams {
  programId: string;
  payload: ProgramDto;
}

export const UpdateProgramStore = signalStore(
  withState<IUpdateProgramStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router)
  })),
  withMethods(({ _http, _toast, _router, ...store }) => ({
    updateProgram: rxMethod<IUpdateProgramParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ programId, payload }) => {
          return _http.patch<{ data: IProgram }>(`programs/${programId}`, payload).pipe(
            tap(() => {
              _toast.showSuccess('Programme mis à jour');
              _router.navigate(['/programs']);
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError('Échec de la mise à jour');
              patchState(store, { isLoading: false });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
