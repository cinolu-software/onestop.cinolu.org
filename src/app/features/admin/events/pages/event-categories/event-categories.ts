import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule, X, SquarePen, Plus, Trash, Search } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ICategory } from '@shared/models/entities.models';
import { FilterEventCategoriesDto } from '../../dto/categories/filter-categories.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CategoriesStore } from '../../store/event-categories.store';

@Component({
  selector: 'app-event-categories',
  templateUrl: './event-categories.html',
  providers: [CategoriesStore, ConfirmationService],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    Dialog,
    ConfirmPopup
  ]
})
export class EventCategories implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  addCategoryForm: FormGroup;
  updateCategoryForm: FormGroup;
  categoriesStore = inject(CategoriesStore);
  showAddModal = signal(false);
  showEditModal = signal(false);
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
    this.categoriesStore.loadCategories(this.queryParams());
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
    this.#router.navigate(['/event-categories'], { queryParams }).then();
  }

  updateRouteAndCategories(): void {
    this.updateRoute();
    this.loadCategories();
  }

  onAddCategory(): void {
    if (this.addCategoryForm.invalid) return;
    this.categoriesStore.addCategory({
      payload: this.addCategoryForm.value,
      onSuccess: () => this.onToggleAddModal()
    });
  }

  onUpdateCategory(): void {
    if (this.updateCategoryForm.invalid) return;
    this.categoriesStore.updateCategory({
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
        this.categoriesStore.deleteCategory({ id: categoryId });
      }
    });
  }
}
