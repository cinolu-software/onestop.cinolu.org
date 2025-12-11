import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { ToastrService } from '@shared/services/toast/toastr.service';
import { IForm, IFormField } from '@shared/models';

interface ICreatePhaseFormDto {
  title: string;
  description?: string;
  welcome_message?: string;
  is_active: boolean;
  phase: string;
  fields: IFormField[];
}

type IUpdatePhaseFormDto = Partial<ICreatePhaseFormDto>;

interface IPhaseFormsStore {
  isLoading: boolean;
  forms: IForm[];
}

export const ProjectFormsStore = signalStore(
  withState<IPhaseFormsStore>({
    isLoading: false,
    forms: []
  }),
  withProps(() => ({
    _http: inject(HttpClient),
    _toast: inject(ToastrService)
  })),
  withMethods(({ _http, _toast, ...store }) => ({
    loadFormsByPhase: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((phaseId) =>
          _http.get<{ data: IForm[] }>(`forms/phase/${phaseId}`).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, forms: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, forms: [] });
              _toast.showError('Erreur lors du chargement des formulaires');
              return of(null);
            })
          )
        )
      )
    ),
    createForm: rxMethod<ICreatePhaseFormDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((formDto) =>
          _http.post<{ data: IForm }>('forms', formDto).pipe(
            map(({ data }) => {
              const currentForms = store.forms();
              patchState(store, { isLoading: false, forms: [...currentForms, data] });
              _toast.showSuccess('Formulaire créé avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la création du formulaire');
              return of(null);
            })
          )
        )
      )
    ),
    updateForm: rxMethod<{ id: string; data: IUpdatePhaseFormDto }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, data }) =>
          _http.patch<{ data: IForm }>(`forms/${id}`, data).pipe(
            map(({ data: updatedForm }) => {
              const updatedForms = store
                .forms()
                .map((form) => (form.id === id ? updatedForm : form));
              patchState(store, { isLoading: false, forms: updatedForms });
              _toast.showSuccess('Formulaire mis à jour avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la mise à jour du formulaire');
              return of(null);
            })
          )
        )
      )
    ),
    deleteForm: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((formId) =>
          _http.delete(`forms/${formId}`).pipe(
            map(() => {
              const filteredForms = store.forms().filter((form) => form.id !== formId);
              patchState(store, { isLoading: false, forms: filteredForms });
              _toast.showSuccess('Formulaire supprimé avec succès');
            }),
            catchError(() => {
              patchState(store, { isLoading: false });
              _toast.showError('Erreur lors de la suppression du formulaire');
              return of(null);
            })
          )
        )
      )
    )
  }))
);
