import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterArticlesTagsDto } from '../../dto/filter-tags.dto';
import { buildQueryParams } from '@shared/helpers';
import { ITag } from '@shared/models/entities.models';

interface ITagsStore {
  isLoading: boolean;
  tags: [ITag[], number];
  lastQuery: FilterArticlesTagsDto | null;
}

export const TagsStore = signalStore(
  withState<ITagsStore>({ isLoading: false, tags: [[], 0], lastQuery: null }),
  withProps(() => ({
    _http: inject(HttpClient)
  })),
  withMethods(({ _http, ...store }) => ({
    loadTags: rxMethod<FilterArticlesTagsDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((queryParams) => {
          patchState(store, { lastQuery: queryParams });
          const params = buildQueryParams(queryParams);
          return _http.get<{ data: [ITag[], number] }>('tags/filtered', { params }).pipe(
            map(({ data }) => {
              patchState(store, { isLoading: false, tags: data });
            }),
            catchError(() => {
              patchState(store, { isLoading: false, tags: [[], 0] });
              return of(null);
            })
          );
        })
      )
    ),

    addTag: (tag: ITag): void => {
      const [tags, count] = store.tags();
      patchState(store, { tags: [[tag, ...tags], count + 1] });
    },

    updateTag: (tag: ITag): void => {
      const [tags, count] = store.tags();
      const updated = tags.map((t) => (t.id === tag.id ? tag : t));
      patchState(store, { tags: [updated, count] });
    },

    deleteTag: (id: string): void => {
      const [tags, count] = store.tags();
      const filtered = tags.filter((tag) => tag.id !== id);
      patchState(store, { tags: [filtered, count - 1] });
    }
  }))
);
