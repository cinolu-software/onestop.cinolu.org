import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProgramDto } from '../../dto/programs/program.dto';
import { ToastrService } from '@core/services/toast/toastr.service';
import { Router } from '@angular/router';

interface IAddProgramStore {
  isLoading: boolean;
}

export const AddProgramStore = signalStore(
  withState<IAddProgramStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router),
  })),
  withMethods(({ _http, _toast, _router, ...store }) => ({
    addProgram: rxMethod<ProgramDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) => {
          return _http.post('programs', payload).pipe(
            tap(() => {
              _router.navigate(['/dashboard/programs']);
              _toast.showSuccess('Programme ajouté');
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError("Échec de l'ajout du rôle");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
