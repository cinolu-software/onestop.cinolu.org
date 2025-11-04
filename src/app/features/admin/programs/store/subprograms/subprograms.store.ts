import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterSubprogramsDto } from '../../dto/subprograms/filter-subprograms.dto';
import { buildQueryParams } from '@shared/helpers';
import { ISubprogram } from '@shared/models/entities.models';

interface IProgramsStore {
  isLoading: boolean;
  subprograms: [ISubprogram[], number];
}

export const SubprogramsStore = signalStore(
  withState<IProgramsStore>({ isLoading: false, subprograms: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadPrograms: rxMethod<FilterSubprogramsDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http
            .get<{
              data: [ISubprogram[], number];
            }>('subprograms/paginated', { params })
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
    addProgram: (subprogram: ISubprogram): void => {
      const [subprograms, count] = store.subprograms();
      patchState(store, {
        subprograms: [[subprogram, ...subprograms], count + 1]
      });
    },
    updateProgram: (subprogram: ISubprogram): void => {
      const [subprograms, count] = store.subprograms();
      const updated = subprograms.map((sp) => (sp.id === subprogram.id ? subprogram : sp));
      patchState(store, { subprograms: [updated, count] });
    },
    deleteProgram: (id: string): void => {
      const [subprograms, count] = store.subprograms();
      const filtered = subprograms.filter((subprogram) => subprogram.id !== id);
      patchState(store, { subprograms: [filtered, count - 1] });
    }
  }))
);
