import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RolesStore } from './roles.store';
import { RoleDto } from '../../dto/roles/role.dto';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IRole } from '@shared/models/entities.models';

interface IAddRoleStore {
  isLoading: boolean;
}

interface IAddRoleParams {
  payload: RoleDto;
  onSuccess: () => void;
}

export const AddRoleStore = signalStore(
  withState<IAddRoleStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _rolesStore: inject(RolesStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _rolesStore, _toast, ...store }) => ({
    addRole: rxMethod<IAddRoleParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) => {
          return _http.post<{ data: IRole }>('roles', payload).pipe(
            map(({ data }) => {
              _rolesStore.addRole(data);
              _toast.showSuccess('Rôle ajouté avec succès');
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError("Échec de l'ajout du rôle");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
