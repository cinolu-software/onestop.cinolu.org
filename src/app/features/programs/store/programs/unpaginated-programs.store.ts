import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, of, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProject } from '@shared/models';

interface IUnpaginatedProgramsStore {
  isLoading: boolean;
  programs: IProject[];
}

export const UnpaginatedProgramsStore = signalStore(
  withState<IUnpaginatedProgramsStore>({ isLoading: false, programs: [] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadPrograms: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return _http.get<{ data: IProject[] }>('programs').pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, programs: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, programs: [] });
              return of(null);
            })
          );
        })
      )
    )
  })),
  withHooks({
    onInit({ loadPrograms }) {
      loadPrograms();
    }
  })
);
