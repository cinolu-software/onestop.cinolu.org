import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProgram } from '@shared/models';

interface IProgramStore {
  isLoading: boolean;
  program: IProgram | null;
}

export const ProgramStore = signalStore(
  { providedIn: 'root' },
  withState<IProgramStore>({ isLoading: false, program: null }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadProgram: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) => {
          return _http.get<{ data: IProgram }>(`programs/slug/${slug}`).pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false, program: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, program: null });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
