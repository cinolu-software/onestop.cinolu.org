import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule, RefreshCcw, SquarePen, Plus, Trash, Search, X } from 'lucide-angular';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgramCategoriesStore } from '../../store/program-categories.store';
import { ICategory } from '@shared/models';
import { FilterProgramCategoriesDto } from '../../dto/categories/filter-categories.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UiButton, UiConfirmDialog, UiDialog, UiInput } from '@shared/ui';
import { ConfirmationService } from '@shared/services/confirmation';

@Component({
  selector: 'app-project-categories',
  templateUrl: './program-categories.html',
  providers: [ProgramCategoriesStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    UiButton,
    NgxPaginationModule,
    ReactiveFormsModule,
    UiDialog,
    UiConfirmDialog,
    UiInput
  ]
})
export class ProgramCategories implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  addCategoryForm: FormGroup;
  updateCategoryForm: FormGroup;
  store = inject(ProgramCategoriesStore);
  showAddModal = signal(false);
  showEditModal = signal(false);
  skeletonArray = Array.from({ length: 100 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    refresh: RefreshCcw,
    edit: SquarePen,
    trash: Trash,
    plus: Plus,
    search: Search,
    x: X
  };
  queryParams = signal<FilterProgramCategoriesDto>({
    page: this.#route.snapshot.params['page'],
    q: this.#route.snapshot.params['q']
  });

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
    this.addCategoryForm = this.#fb.group({
      name: ['', Validators.required]
    });
    this.updateCategoryForm = this.#fb.group({
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
    this.store.loadCategories(this.queryParams());
  }

  onToggleAddModal(): void {
    this.showAddModal.set(!this.showAddModal());
    if (this.showAddModal()) this.addCategoryForm.reset();
  }

  onToggleEditModal(category: ICategory | null): void {
    this.updateCategoryForm.patchValue({
      id: category?.id || '',
      name: category?.name || ''
    });
    this.showEditModal.update((v) => !v);
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndCategories();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/program-categories'], { queryParams }).then();
  }

  updateRouteAndCategories(): void {
    this.updateRoute();
    this.loadCategories();
  }

  onAddCategory(): void {
    if (this.addCategoryForm.invalid) return;
    this.store.addCategory({
      payload: this.addCategoryForm.value,
      onSuccess: () => this.onToggleAddModal()
    });
  }

  onUpdateCategory(): void {
    if (this.updateCategoryForm.invalid) return;
    this.store.updateCategory({
      id: this.updateCategoryForm.value.id,
      payload: this.updateCategoryForm.value,
      onSuccess: () => this.onToggleEditModal(null)
    });
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
        this.store.deleteCategory(categoryId);
      }
    });
  }
}
