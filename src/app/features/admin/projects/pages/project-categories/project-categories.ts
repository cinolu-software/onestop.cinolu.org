import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule, SquarePen, Plus, Trash, Search, X } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { CategoriesStore } from '../../store/project-categories.store';
import { ICategory } from '@shared/models/entities.models';
import { FilterProjectCategoriesDto } from '../../dto/categories/filter-categories.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-project-categories',
  templateUrl: './project-categories.html',
  providers: [CategoriesStore, ConfirmationService],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ConfirmPopup
  ]
})
export class ProjectCategories implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  categoryForm: FormGroup;
  store = inject(CategoriesStore);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    edit: SquarePen,
    trash: Trash,
    plus: Plus,
    search: Search,
    x: X
  };
  queryParams = signal<FilterProjectCategoriesDto>({
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

  get count(): number {
    return this.store.categories()[1];
  }

  loadCategories(): void {
    this.store.loadCategories(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndCategories();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/project-categories'], { queryParams });
  }

  updateRouteAndCategories(): void {
    this.updateRoute();
    this.loadCategories();
  }

  onDeleteCategory(categoryId: string, event: Event): void {
    this.#confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Etes-vous sûr ?',
      acceptLabel: 'Confirmer',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        severity: 'danger'
      },
      accept: () => {
        this.store.deleteCategory({ id: categoryId });
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
      this.store.updateCategory({
        id,
        payload: { id, name },
        onSuccess: () => this.onCancelForm()
      });
      return;
    }

    this.store.addCategory({
      payload: { name },
      onSuccess: () => this.onCancelForm()
    });
  }
}
