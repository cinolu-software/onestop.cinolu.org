import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ISubprogram } from '@shared/models/entities.models';
import { SubprogramsStore } from './subprograms.store';

interface IPublishSubprogramStore {
  isLoading: boolean;
  subprogram: ISubprogram | null;
}

export const PublishSubprogramsStore = signalStore(
  withState<IPublishSubprogramStore>({ isLoading: false, subprogram: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _subprogramsStore: inject(SubprogramsStore),
  })),
  withMethods(({ _http, _subprogramsStore, ...store }) => ({
    publishProgram: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.post<{ data: ISubprogram }>(`subprograms/publish/${id}`, {}).pipe(
            map(({ data }) => {
              _subprogramsStore.updateProgram(data);
              patchState(store, { isLoading: false, subprogram: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, subprogram: null });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
