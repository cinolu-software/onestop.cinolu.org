import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  LucideAngularModule,
  SquarePen,
  Trash,
  Plus,
  Search,
  Eye,
  EyeOff,
  Star,
  StarOff,
  FileX,
  Sparkles,
  Funnel
} from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProgramsStore } from '../../store/programs.store';
import { FilterProgramsDto } from '../../dto/programs/filter-programs.dto';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
// Removed per-action stores in favor of unified ProgramsStore
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { AvatarModule } from 'primeng/avatar';
// Removed per-action stores in favor of unified ProgramsStore
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Tabs } from '@shared/components/tabs/tabs';

@Component({
  selector: 'app-list-programs',
  templateUrl: './list-programs.html',
  providers: [ProgramsStore, ConfirmationService],
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
    RouterLink,
    Tabs
  ]
})
export class ListPrograms implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(ProgramsStore);
  publishStore = null;
  deleteStore = null;
  highlightStore = null;
  // Use unified store for all actions
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
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
    filter: Funnel,
    fileX: FileX,
    sparkles: Sparkles
  };
  queryParams = signal<FilterProgramsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q'),
    filter: (this.#route.snapshot.queryParamMap.get('filter') as FilterProgramsDto['filter']) || 'all'
  });
  activeTab = signal<string>(this.#route.snapshot.queryParamMap.get('filter') || 'all');
  tabsConfig = signal([
    { label: 'Tous', name: 'all' },
    { label: 'Publiés', name: 'published' },
    { label: 'Brouillons', name: 'drafts' },
    { label: 'En vedette', name: 'highlighted' }
  ]);

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
  }

  ngOnInit(): void {
    this.loadPrograms();
    this.updateTabCounts();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndPrograms();
      });
  }

  updateTabCounts(): void {
    const tabs = this.tabsConfig();
    this.tabsConfig.set([...tabs]);
  }

  onTabChange(tabName: string): void {
    this.activeTab.set(tabName);
    this.queryParams().filter = tabName as FilterProgramsDto['filter'];
    this.queryParams().page = null;
    this.updateRouteAndPrograms();
  }

  loadPrograms(): void {
    this.store.loadPrograms(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndPrograms();
  }

  onPublish(id: string): void {
    this.store.publishProgram(id);
  }

  onFileUploadLoaded(): void {
    this.loadPrograms();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/programs'], { queryParams });
  }

  highlightProgram(id: string): void {
    this.store.highlight(id);
  }

  updateRouteAndPrograms(): void {
    this.updateRoute();
    this.loadPrograms();
  }

  onDelete(roleId: string, event: Event): void {
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
        this.store.deleteProgram(roleId);
      }
    });
  }
}
