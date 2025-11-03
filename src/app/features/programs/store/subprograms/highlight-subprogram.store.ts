import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@core/services/toast/toastr.service';
import { ISubprogram } from '@shared/models/entities.models';
import { SubprogramsStore } from './subprograms.store';

interface IHighlightStore {
  isLoading: boolean;
}

export const HighlightSubprogramStore = signalStore(
  withState<IHighlightStore>({ isLoading: false }),
  withProps(() => ({
    _http: inject(HttpClient),
    _subprogramsStore: inject(SubprogramsStore),
    _toast: inject(ToastrService),
  })),
  withMethods(({ _http, _subprogramsStore, _toast, ...store }) => ({
    highlight: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return _http.patch<{ data: ISubprogram }>(`subprograms/highlight/${id}`, {}).pipe(
            map(({ data }) => {
              _subprogramsStore.updateProgram(data);
              _toast.showSuccess(
                data.is_highlighted ? 'Programme mis en avant' : 'Programme retiré de la mise en avant',
              );
              patchState(store, { isLoading: false });
            }),
            catchError(() => {
              _toast.showError('Erreur lors de la mise en avant du programme');
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
