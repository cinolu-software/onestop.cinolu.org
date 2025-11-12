import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, of, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '@shared/models/entities.models';

interface IStaffStore {
  isLoading: boolean;
  staff: IUser[];
}

export const StaffStore = signalStore(
  withState<IStaffStore>({ isLoading: false, staff: [] }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadStaff: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() => {
          return _http.get<{ data: IUser[] }>('users/find-staff').pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, staff: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, staff: [] });
              return of(null);
            })
          );
        })
      )
    )
  })),
  withHooks({
    onInit({ loadStaff }) {
      loadStaff(undefined);
    }
  })
);
