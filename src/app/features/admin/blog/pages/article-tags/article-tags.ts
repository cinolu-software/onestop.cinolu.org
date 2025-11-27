import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, Plus, RefreshCcw, Search, SquarePen, Trash, X } from 'lucide-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagsStore } from '../../store/tag.store';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterArticlesTagsDto } from '../../dto/filter-tags.dto';
import { CommonModule } from '@angular/common';
import { ITag } from '@shared/models/entities.models';
import { ConfirmationService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-article-tags',
  providers: [ConfirmationService, TagsStore],
  imports: [
    LucideAngularModule,
    ReactiveFormsModule,
    ConfirmPopup,
    InputText,
    ProgressSpinnerModule,
    ButtonModule,
    NgxPaginationModule,
    CommonModule
  ],
  templateUrl: './article-tags.html'
})
export class ArticleTags implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  tagForm: FormGroup;
  store = inject(TagsStore);
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
  queryParams = signal<FilterArticlesTagsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q')
  });
  formVisible = signal(false);
  formMode = signal<'create' | 'edit'>('create');
  editingTag = signal<ITag | null>(null);

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
    this.tagForm = this.#fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.store.loadTags(this.queryParams());
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndTags();
      });
  }

  loadTags() {
    this.store.loadTags(this.queryParams());
  }

  async onPageChange(currentPage: number): Promise<void> {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    await this.updateRouteAndTags();
  }

  async updateRoute(): Promise<void> {
    const queryParams = this.queryParams();
    await this.#router.navigate(['/blog/tags'], { queryParams });
  }

  async updateRouteAndTags(): Promise<void> {
    await this.updateRoute();
    this.loadTags();
  }

  onDeleteTag(tagId: string, tag: Event): void {
    this.#confirmationService.confirm({
      target: tag.currentTarget as EventTarget,
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
        this.store.delete({ id: tagId });
      }
    });
  }

  onToggleForm(tag: ITag | null = null): void {
    if (tag) {
      this.formMode.set('edit');
      this.editingTag.set(tag);
      this.tagForm.patchValue({
        id: tag.id,
        name: tag.name
      });
      this.formVisible.set(true);
      return;
    }

    this.formMode.set('create');
    this.editingTag.set(null);
    this.tagForm.reset({
      id: '',
      name: ''
    });
    this.formVisible.update((visible) => !visible);
  }

  onCancelForm(): void {
    this.formVisible.set(false);
    this.formMode.set('create');
    this.editingTag.set(null);
    this.tagForm.reset({
      id: '',
      name: ''
    });
  }

  onSubmit(): void {
    if (this.tagForm.invalid) return;
    const { id, name } = this.tagForm.value;
    if (this.formMode() === 'edit' && id) {
      this.store.update({
        id,
        payload: { id, name },
        onSuccess: () => this.onCancelForm()
      });
      return;
    }

    this.store.create({
      payload: { name },
      onSuccess: () => this.onCancelForm()
    });
  }
}
