import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, Plus, RefreshCcw, Search, SquarePen, Trash } from 'lucide-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagsStore } from '../../store/tags/tag.store';
import { AddTagStore } from '../../store/tags/add-tag.store';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterArticlesTagsDto } from '../../dto/filter-tags.dto';
import { CommonModule } from '@angular/common';
import { ITag } from '@shared/models/entities.models';
import { UpdateTagStore } from '../../store/tags/update-tag.store';
import { DeleteTagStore } from '../../store/tags/delete-tag.store';
import { ConfirmationService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-article-tags',
  providers: [ConfirmationService, TagsStore, AddTagStore, UpdateTagStore, DeleteTagStore],
  imports: [
    LucideAngularModule,
    ReactiveFormsModule,
    Dialog,
    ConfirmPopup,
    InputText,
    ProgressSpinnerModule,
    ButtonModule,
    NgxPaginationModule,
    CommonModule,
  ],
  templateUrl: './article-tags.html',
})
export class ArticleTags implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);

  searchForm: FormGroup;
  addTagForm: FormGroup;
  updateTagForm: FormGroup;
  store = inject(TagsStore);
  addTagStore = inject(AddTagStore);
  deleteTagStore = inject(DeleteTagStore);
  updateTagStore = inject(UpdateTagStore);
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
  };
  queryParams = signal<FilterArticlesTagsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q'),
  });

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || ''],
    });
    this.addTagForm = this.#fb.group({
      name: ['', Validators.required],
    });
    this.updateTagForm = this.#fb.group({
      id: [''],
      name: ['', Validators.required],
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

  onToggleAddModal() {
    this.showAddModal.set(!this.showAddModal());
    if (this.showAddModal()) this.addTagForm.reset();
  }

  onToggleEditModal(tag: ITag | null): void {
    this.updateTagForm.patchValue({
      id: tag?.id || '',
      name: tag?.name || '',
    });
    this.showEditModal.update((v) => !v);
  }

  async onPageChange(currentPage: number): Promise<void> {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    await this.updateRouteAndTags();
  }

  async updateRoute(): Promise<void> {
    const queryParams = this.queryParams();
    await this.#router.navigate(['/dashboard/blog/tags'], { queryParams });
  }

  async updateRouteAndTags(): Promise<void> {
    await this.updateRoute();
    this.loadTags();
  }

  onAddTag(): void {
    if (this.addTagForm.invalid) return;
    this.addTagStore.addTag({
      payload: this.addTagForm.value,
      onSuccess: () => this.onToggleAddModal(),
    });
  }

  onUpdateTag(): void {
    if (this.updateTagForm.invalid) return;
    this.updateTagStore.updateTag({
      id: this.updateTagForm.value.id,
      payload: this.updateTagForm.value,
      onSuccess: () => this.onToggleEditModal(null),
    });
  }

  onDeleteTag(tagId: string, tag: Event): void {
    this.#confirmationService.confirm({
      target: tag.currentTarget as EventTarget,
      message: 'Etes-vous sûr ?',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger',
      },
      accept: () => {
        this.deleteTagStore.deleteTag({ id: tagId });
      },
    });
  }
}
