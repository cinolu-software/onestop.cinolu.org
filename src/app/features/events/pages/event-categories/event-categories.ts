import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule, X, SquarePen, Plus, Trash, Search } from 'lucide-angular';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ICategory } from '@shared/models';
import { FilterEventCategoriesDto } from '../../dto/categories/filter-categories.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CategoriesStore } from '../../store/event-categories.store';
import { UiButton, UiConfirmDialog } from '@shared/ui';
import { ConfirmationService } from '@shared/services/confirmation';

@Component({
  selector: 'app-event-categories',
  templateUrl: './event-categories.html',
  providers: [CategoriesStore, ConfirmationService],
  imports: [
    LucideAngularModule,
    CommonModule,
    UiButton,
    NgxPaginationModule,
    ReactiveFormsModule,
    UiConfirmDialog
  ]
})
export class EventCategories implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  categoryForm: FormGroup;
  categoriesStore = inject(CategoriesStore);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    x: X,
    edit: SquarePen,
    trash: Trash,
    plus: Plus,
    search: Search
  };
  queryParams = signal<FilterEventCategoriesDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q')
  });
  formVisible = signal(false);
  formMode = signal<'create' | 'edit'>('create');
  editingCategory = signal<ICategory | null>(null);

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
    this.categoryForm = this.#fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndCategories();
      });
  }

  loadCategories(): void {
    this.categoriesStore.loadCategories(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndCategories();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/event-categories'], { queryParams }).then();
  }

  updateRouteAndCategories(): void {
    this.updateRoute();
    this.loadCategories();
  }

  onDeleteCategory(categoryId: string, event: Event): void {
    this.#confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Etes-vous sûr ?',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger'
      },
      accept: () => {
        this.categoriesStore.deleteCategory({ id: categoryId });
      }
    });
  }

  onToggleForm(category: ICategory | null = null): void {
    if (category) {
      this.formMode.set('edit');
      this.editingCategory.set(category);
      this.categoryForm.patchValue({
        id: category.id,
        name: category.name
      });
      this.formVisible.set(true);
      return;
    }

    this.formMode.set('create');
    this.editingCategory.set(null);
    this.categoryForm.reset({
      id: '',
      name: ''
    });
    this.formVisible.update((visible) => !visible);
  }

  onCancelForm(): void {
    this.formVisible.set(false);
    this.formMode.set('create');
    this.editingCategory.set(null);
    this.categoryForm.reset({
      id: '',
      name: ''
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;
    const { id, name } = this.categoryForm.value;
    if (this.formMode() === 'edit' && id) {
      this.categoriesStore.updateCategory({
        id,
        payload: { id, name },
        onSuccess: () => this.onCancelForm()
      });
      return;
    }

    this.categoriesStore.addCategory({
      payload: { name },
      onSuccess: () => this.onCancelForm()
    });
  }
}
