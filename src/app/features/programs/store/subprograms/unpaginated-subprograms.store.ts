import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, of, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ISubprogram } from '@shared/models/entities.models';

interface IUnpaginatedProgramsStore {
  isLoading: boolean;
  subprograms: ISubprogram[];
}

export const UnpaginatedSubprogramsStore = signalStore(
  withState<IUnpaginatedProgramsStore>({ isLoading: false, subprograms: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    loadSubprograms: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return _http.get<{ data: ISubprogram[] }>('subprograms').pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, subprograms: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, subprograms: [] });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit({ loadSubprograms }) {
      loadSubprograms();
    },
  }),
);
