import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, SquarePen, Trash, Plus, Search, Eye, EyeOff, Star, StarOff } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProgramsStore } from '../../store/programs/programs.store';
import { FilterProgramsDto } from '../../dto/programs/filter-programs.dto';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { DeleteProgramStore } from '../../store/programs/delete-program.store';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { AvatarModule } from 'primeng/avatar';
import { PublishProgramStore } from '../../store/programs/publish-program.store';
import { HighlightProgramStore } from '../../store/programs/highlight-program.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-list-programs',
  templateUrl: './list-programs.html',
  providers: [ProgramsStore, DeleteProgramStore, ConfirmationService, PublishProgramStore, HighlightProgramStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ConfirmPopup,
    ApiImgPipe,
    AvatarModule,
    RouterLink
  ]
})
export class ListPrograms implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(ProgramsStore);
  deleteProgramStore = inject(DeleteProgramStore);
  publishProgramStore = inject(PublishProgramStore);
  highlightStore = inject(HighlightProgramStore);
  skeletonArray = Array.from({ length: 100 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    edit: SquarePen,
    trash: Trash,
    plus: Plus,
    search: Search,
    eye: Eye,
    eyeOff: EyeOff,
    star: Star,
    starOff: StarOff
  };
  queryParams = signal<FilterProgramsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q')
  });

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
  }

  ngOnInit(): void {
    this.loadPrograms();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndPrograms();
      });
  }

  loadPrograms(): void {
    this.store.loadPrograms(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndPrograms();
  }

  onPublishProgram(id: string): void {
    this.publishProgramStore.publishProgram(id);
  }

  onFileUploadLoaded(): void {
    this.loadPrograms();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/dashboard/programs'], { queryParams });
  }

  highlightProgram(id: string): void {
    this.highlightStore.highlight(id);
  }

  updateRouteAndPrograms(): void {
    this.updateRoute();
    this.loadPrograms();
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
        this.deleteProgramStore.deleteProgram({ id: roleId });
      }
    });
  }
}
