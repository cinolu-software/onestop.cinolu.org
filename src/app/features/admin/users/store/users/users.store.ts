import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterUsersDto } from '../../dto/users/filter-users.dto';
import { buildQueryParams } from '@shared/helpers';
import { IUser } from '@shared/models/entities.models';

interface IUsersStore {
  isLoading: boolean;
  users: [IUser[], number];
}

export const UsersStore = signalStore(
  withState<IUsersStore>({ isLoading: false, users: [[], 0] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadUsers: rxMethod<FilterUsersDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [IUser[], number] }>('users', { params }).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, users: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, users: [[], 0] });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
