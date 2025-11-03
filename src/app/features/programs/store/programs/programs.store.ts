import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterProgramsDto } from '../../dto/programs/filter-programs.dto';
import { buildQueryParams } from '@shared/helpers';
import { IProgram } from '@shared/models';

interface IProgramsStore {
  isLoading: boolean;
  programs: [IProgram[], number];
}

export const ProgramsStore = signalStore(
  withState<IProgramsStore>({ isLoading: false, programs: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadPrograms: rxMethod<FilterProgramsDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IProgram[], number] }>('programs/paginated', { params }).pipe(
            tap(({ data }) => {
              patchState(store, { isLoading: false, programs: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, programs: [[], 0] });
              return of(null);
            })
          );
        })
      )
    ),
    updateProgram: (program: IProgram): void => {
      const [programs, count] = store.programs();
      const updated = programs.map((p) => (p.id === program.id ? program : p));
      patchState(store, { programs: [updated, count] });
    },
    deleteProgram: (id: string): void => {
      const [programs, count] = store.programs();
      const filtered = programs.filter((program) => program.id !== id);
      patchState(store, { programs: [filtered, count - 1] });
    }
  }))
);
