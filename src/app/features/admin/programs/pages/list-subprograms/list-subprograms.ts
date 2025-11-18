import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, SquarePen, Trash, Plus, Search, Eye, EyeOff, Star, StarOff, X } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubprogramsStore } from '../../store/subprograms.store';
import { FilterSubprogramsDto } from '../../dto/subprograms/filter-subprograms.dto';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
// unified into SubprogramsStore
import { Textarea } from 'primeng/textarea';
// unified into SubprogramsStore
import { ISubprogram } from '@shared/models/entities.models';
import { FileUpload } from '@shared/components/file-upload/file-upload';
import { environment } from '@environments/environment';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { AvatarModule } from 'primeng/avatar';
// unified into SubprogramsStore
import { ProgramsStore } from '../../store/programs.store';
import { SelectModule } from 'primeng/select';
// unified into SubprogramsStore
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-list-subprograms',
  templateUrl: './list-subprograms.html',
  providers: [ProgramsStore, SubprogramsStore, ConfirmationService],
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
  programsStore = inject(ProgramsStore);
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
    // load flat list of programs for selects
    this.programsStore.loadUnpaginatedPrograms();
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
    this.store.highlightSubprogram(id);
  }

  loadSubprograms(): void {
    this.store.loadPrograms(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndSubrograms();
  }

  onPublishProgram(id: string): void {
    this.store.publishSubprogram(id);
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
    this.store.addSubprogram({
      payload: this.addSubprogramForm.value,
      onSuccess: () => {
        this.onToggleAddModal();
        this.addSubprogramForm.reset();
      }
    });
  }

  onUpdateProgram(): void {
    this.store.updateSubprogram({
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
        this.store.deleteSubprogram(roleId);
      }
    });
  }
}
