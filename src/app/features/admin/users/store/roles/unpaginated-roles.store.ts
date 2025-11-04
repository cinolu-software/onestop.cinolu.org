import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, of, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IRole } from '@shared/models/entities.models';

interface IUnpaginatedRolesStore {
  isLoading: boolean;
  roles: IRole[];
}

export const UnpaginatedRolesStore = signalStore(
  withState<IUnpaginatedRolesStore>({ isLoading: false, roles: [] }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withMethods(({ _http, ...store }) => ({
    loadRoles: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return _http.get<{ data: IRole[] }>('roles').pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, roles: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, roles: [] });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit({ loadRoles }) {
      loadRoles();
    },
  }),
);
