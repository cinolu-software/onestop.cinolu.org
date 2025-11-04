import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterRolesDto } from '../../dto/roles/filter-roles.dto';
import { buildQueryParams } from '@shared/helpers';
import { IRole } from '@shared/models/entities.models';

interface IRolesStore {
  isLoading: boolean;
  roles: [IRole[], number];
}

export const RolesStore = signalStore(
  withState<IRolesStore>({ isLoading: false, roles: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadRoles: rxMethod<FilterRolesDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IRole[], number] }>('roles/paginated', { params }).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, roles: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, roles: [[], 0] });
              return of(null);
            })
          );
        })
      )
    ),
    addRole: (role: IRole): void => {
      const [roles, count] = store.roles();
      patchState(store, { roles: [[role, ...roles], count + 1] });
    },
    updateRole: (role: IRole): void => {
      const [roles, count] = store.roles();
      const updated = roles.map((r) => (r.id === role.id ? role : r));
      patchState(store, { roles: [updated, count] });
    },
    deleteRole: (id: string): void => {
      const [roles, count] = store.roles();
      const filtered = roles.filter((role) => role.id !== id);
      patchState(store, { roles: [filtered, count - 1] });
    }
  }))
);
