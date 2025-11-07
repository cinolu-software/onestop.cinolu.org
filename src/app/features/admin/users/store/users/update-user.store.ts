import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserDto } from '../../dto/users/user.dto';
import { ToastrService } from '@core/services/toast/toastr.service';
import { IUser } from '@shared/models/entities.models';

interface IUpdateUserStore {
  isLoading: boolean;
  user: IUser | null;
}

export const UpdateUserStore = signalStore(
  withState<IUpdateUserStore>({ isLoading: false, user: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService),
    _router: inject(Router)
  })),
  withMethods(({ _http, _toast, _router, ...store }) => ({
    updateUser: rxMethod<UserDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((userData) => {
          return _http.patch<{ data: IUser }>(`users/${userData.id}`, userData).pipe(
            map(({ data }) => {
              _router.navigate(['/users']);
              _toast.showSuccess('Utilisateur mis à jour avec succès');
              patchState(store, { isLoading: false, user: data });
            }),
            catchError(() => {
              _toast.showError("Erreur lors de la mise à jour de l'utilisateur");
              patchState(store, { isLoading: false, user: null });
              return of(null);
            })
          );
        })
      )
    )
  }))
);
