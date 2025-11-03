import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RolesStore } from './roles.store';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IDeleteRoleStore {
  isLoading: boolean;
}

export const DeleteRoleStore = signalStore(
  withState<IDeleteRoleStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _rolesStore: inject(RolesStore),
  })),
  withMethods(({ _http, _rolesStore, _toast, ...store }) => ({
    deleteRole: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.delete<void>(`roles/${id}`).pipe(
            map(() => {
              patchState(store, { isLoading: false });
              _rolesStore.deleteRole(id);
              _toast.showSuccess('Rôle supprimé avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Échec de la suppression du rôle');
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
