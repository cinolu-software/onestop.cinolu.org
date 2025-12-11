import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  LucideAngularModule,
  SquarePen,
  Trash,
  Search,
  Plus,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Filter,
  FileX,
  Sparkles,
  X
} from 'lucide-angular';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProjectsStore } from '../../store/projects.store';

// Removed legacy per-action stores in favor of unified ProjectsStore

import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { FilterProjectsDto } from '../../dto/projects/filter-projects.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { IndicatorsStore } from '@features/programs/store/indicators.store';
import { UiAvatar, UiButton, UiConfirmDialog, UiTabs } from '@shared/ui';
import { ConfirmationService } from '@shared/services/confirmation';

@Component({
  selector: 'app-projects-list',
  templateUrl: './list-projects.html',
  providers: [ProjectsStore, IndicatorsStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    UiButton,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterLink,
    UiConfirmDialog,
    UiAvatar,
    ApiImgPipe,
    UiTabs
  ]
})
export class ListProjects implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(ProjectsStore);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    edit: SquarePen,
    trash: Trash,
    search: Search,
    plus: Plus,
    eye: Eye,
    eyeOff: EyeOff,
    star: Star,
    starOff: StarOff,
    filter: Filter,
    fileX: FileX,
    sparkles: Sparkles,
    x: X
  };
  queryParams = signal<FilterProjectsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q'),
    filter:
      (this.#route.snapshot.queryParamMap.get('filter') as FilterProjectsDto['filter']) || 'all'
  });
  activeTab = signal<string>(this.#route.snapshot.queryParamMap.get('filter') || 'all');
  tabsConfig = signal([
    { label: 'Tous les projets', name: 'all' },
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
    this.loadProjects();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndProjects();
      });
  }

  onTabChange(tabName: string): void {
    this.activeTab.set(tabName);
    this.queryParams().filter = tabName as FilterProjectsDto['filter'];
    this.queryParams().page = null;
    this.updateRouteAndProjects();
  }

  loadProjects(): void {
    this.store.loadProjects(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndProjects();
  }

  highlightProject(projectId: string): void {
    this.store.highlight(projectId);
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/projects'], { queryParams });
  }

  updateRouteAndProjects(): void {
    this.updateRoute();
    this.loadProjects();
  }

  onPublishProject(projectId: string): void {
    this.store.publishProject(projectId);
  }

  onDeleteProject(projectId: string, event: Event): void {
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
        this.store.deleteProject(projectId);
      }
    });
  }
}
