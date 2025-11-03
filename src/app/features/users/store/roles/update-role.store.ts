import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RolesStore } from './roles.store';
import { RoleDto } from '../../dto/roles/role.dto';
import { IRole } from '@shared/models/entities.models';
import { ToastrService } from '@core/services/toast/toastr.service';

interface IUpdateRoleStore {
  isLoading: boolean;
}

interface IUpdateRoleParams {
  payload: RoleDto;
  onSuccess: () => void;
}

export const UpdateRoleStore = signalStore(
  withState<IUpdateRoleStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _rolesStore: inject(RolesStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _rolesStore, _toast, ...store }) => ({
    updateRole: rxMethod<IUpdateRoleParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) => {
          return _http.patch<{ data: IRole }>(`roles/${payload.id}`, payload).pipe(
            map(({ data }) => {
              _rolesStore.updateRole(data);
              _toast.showSuccess('Rôle mis à jour avec succès');
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError('Erreur lors de la mise à jour du rôle');
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
