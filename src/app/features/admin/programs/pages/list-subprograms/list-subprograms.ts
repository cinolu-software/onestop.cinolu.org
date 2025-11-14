import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, SquarePen, Trash, Plus, Search, Eye, EyeOff, Star, StarOff, X } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubprogramsStore } from '../../store/subprograms/subprograms.store';
import { FilterSubprogramsDto } from '../../dto/subprograms/filter-subprograms.dto';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { AddSubprogramsStore } from '../../store/subprograms/add-subprograms.store';
import { Textarea } from 'primeng/textarea';
import { UpdateSubprogramsStore } from '../../store/subprograms/update-subprograms.store';
import { DeleteSubprogramsStore } from '../../store/subprograms/delete-subprograms.store';
import { ISubprogram } from '@shared/models/entities.models';
import { FileUpload } from '@shared/components/file-upload/file-upload';
import { environment } from '@environments/environment';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { AvatarModule } from 'primeng/avatar';
import { PublishSubprogramsStore } from '../../store/subprograms/publish-subprograms.store';
import { UnpaginatedProgramsStore } from '../../store/programs/unpaginated-programs.store';
import { SelectModule } from 'primeng/select';
import { HighlightSubprogramStore } from '../../store/subprograms/highlight-subprogram.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-list-subprograms',
  templateUrl: './list-subprograms.html',
  providers: [
    UnpaginatedProgramsStore,
    SubprogramsStore,
    DeleteSubprogramsStore,
    UpdateSubprogramsStore,
    AddSubprogramsStore,
    ConfirmationService,
    PublishSubprogramsStore,
    HighlightSubprogramStore
  ],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ConfirmPopup,
    Dialog,
    Textarea,
    FileUpload,
    ApiImgPipe,
    AvatarModule,
    SelectModule
  ]
})
export class ListSubprograms implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  addSubprogramForm: FormGroup;
  updateSubprogramForm: FormGroup;
  store = inject(SubprogramsStore);
  programsStore = inject(UnpaginatedProgramsStore);
  addSubprogramStore = inject(AddSubprogramsStore);
  updateSubrogramStore = inject(UpdateSubprogramsStore);
  deleteSubrogramStore = inject(DeleteSubprogramsStore);
  publishSubrogramStore = inject(PublishSubprogramsStore);
  highlightStore = inject(HighlightSubprogramStore);
  subprogram = signal<ISubprogram | null>(null);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
  url = environment.apiUrl + 'subprograms/logo/';
  #destroyRef = inject(DestroyRef);
  icons = {
    edit: SquarePen,
    trash: Trash,
    plus: Plus,
    search: Search,
    eye: Eye,
    eyeOff: EyeOff,
    star: Star,
    starOff: StarOff,
    x: X
  };
  showAddModal = signal(false);
  showEditModal = signal(false);
  queryParams = signal<FilterSubprogramsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q')
  });

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
    this.addSubprogramForm = this.#fb.group({
      name: ['', Validators.required],
      programId: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.updateSubprogramForm = this.#fb.group({
      id: ['', Validators.required],
      programId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSubprograms();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndSubrograms();
      });
  }

  get count(): number {
    return this.store.subprograms()[1];
  }

  highlightSubprogram(id: string): void {
    this.highlightStore.highlight(id);
  }

  loadSubprograms(): void {
    this.store.loadPrograms(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndSubrograms();
  }

  onPublishProgram(id: string): void {
    this.publishSubrogramStore.publishProgram(id);
  }

  onFileUploadLoaded(): void {
    this.loadSubprograms();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/subprograms'], { queryParams });
  }

  updateRouteAndSubrograms(): void {
    this.updateRoute();
    this.loadSubprograms();
  }

  onToggleAddModal(): void {
    this.showAddModal.update((v) => !v);
  }

  onToggleEditModal(subprogram: ISubprogram | null): void {
    this.subprogram.set(subprogram);
    this.updateSubprogramForm.patchValue({
      id: subprogram?.id || '',
      programId: subprogram?.program?.id || '',
      name: subprogram?.name || '',
      description: subprogram?.description || ''
    });
    this.showEditModal.update((v) => !v);
  }

  onAddProgram(): void {
    this.addSubprogramStore.addProgram({
      payload: this.addSubprogramForm.value,
      onSuccess: () => {
        this.onToggleAddModal();
        this.addSubprogramForm.reset();
      }
    });
  }

  onUpdateProgram(): void {
    this.updateSubrogramStore.updateProgram({
      payload: this.updateSubprogramForm.value,
      onSuccess: () => {
        this.onToggleEditModal(null);
        this.updateSubprogramForm.reset();
      }
    });
  }

  onDeleteRole(roleId: string, event: Event): void {
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
        this.deleteSubrogramStore.deleteProgram(roleId);
      }
    });
  }
}
