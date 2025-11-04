import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SubprogramsStore } from './subprograms.store';
import { SubprogramDto } from '../../dto/subprograms/subprograms.dto';
import { ToastrService } from '@core/services/toast/toastr.service';
import { ISubprogram } from '@shared/models/entities.models';

interface IAddSubprogramStore {
  isLoading: boolean;
}

interface IAddSubprogramParams {
  payload: SubprogramDto;
  onSuccess: () => void;
}

export const AddSubprogramsStore = signalStore(
  withState<IAddSubprogramStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _subprogramsStore: inject(SubprogramsStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _subprogramsStore, _toast, ...store }) => ({
    addProgram: rxMethod<IAddSubprogramParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) => {
          return _http.post<{ data: ISubprogram }>('subprograms', payload).pipe(
            map(({ data }) => {
              _subprogramsStore.addProgram(data);
              _toast.showSuccess('Sous programme ajouté');
              patchState(store, { isLoading: false });
              onSuccess();
            }),
            catchError(() => {
              _toast.showError("Échec de l'ajout du sous programme");
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
