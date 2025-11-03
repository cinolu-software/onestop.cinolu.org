import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProgramsStore } from './programs.store';
import { IProgram } from '@shared/models';
import { ToastrService } from '@core/services/toast';

interface IHighlightStore {
  isLoading: boolean;
}

export const HighlightProgramStore = signalStore(
  withState<IHighlightStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _programsStore: inject(ProgramsStore),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _programsStore, _toast, ...store }) => ({
    highlight: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.patch<{ data: IProgram }>(`programs/highlight/${id}`, {}).pipe(
            map(({ data }) => {
              _programsStore.updateProgram(data);
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
          );
        })
      )
    )
  }))
);
