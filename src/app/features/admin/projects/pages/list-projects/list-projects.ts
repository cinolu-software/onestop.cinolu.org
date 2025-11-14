import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  LucideAngularModule,
  RefreshCcw,
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
  Sparkles
} from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProjectsStore } from '../../store/projects/projects.store';
import { ConfirmationService } from 'primeng/api';
import { DeleteProjectStore } from '../../store/projects/delete-project.store';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { AvatarModule } from 'primeng/avatar';
import { PublishProjectStore } from '../../store/projects/publish-project.store';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { HighlightProjectStore } from '../../store/projects/highlight-project.store';
import { FilterProjectsDto } from '../../dto/projects/filter-projects.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Tabs } from '@shared/components/tabs/tabs';

@Component({
  selector: 'app-projects-list',
  templateUrl: './list-projects.html',
  providers: [ProjectsStore, PublishProjectStore, DeleteProjectStore, HighlightProjectStore, ConfirmationService],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterLink,
    ConfirmPopup,
    AvatarModule,
    ApiImgPipe,
    Tabs
  ]
})
export class ListProjects implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(ProjectsStore);
  deleteProjectStore = inject(DeleteProjectStore);
  publishProjectStore = inject(PublishProjectStore);
  highlightStore = inject(HighlightProjectStore);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    refresh: RefreshCcw,
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
    sparkles: Sparkles
  };
  queryParams = signal<FilterProjectsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q'),
    filter: (this.#route.snapshot.queryParamMap.get('filter') as FilterProjectsDto['filter']) || 'all'
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

  async onPageChange(currentPage: number): Promise<void> {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    await this.updateRouteAndProjects();
  }

  highlightProject(projectId: string): void {
    this.highlightStore.highlight(projectId);
  }

  async updateRoute(): Promise<void> {
    const queryParams = this.queryParams();
    await this.#router.navigate(['/projects'], { queryParams });
  }

  async updateRouteAndProjects(): Promise<void> {
    await this.updateRoute();
    this.loadProjects();
  }

  onPublishProject(projectId: string): void {
    this.publishProjectStore.publishProject(projectId);
  }

  onDeleteProject(projectId: string, event: Event): void {
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
        this.deleteProjectStore.deleteProject(projectId);
      }
    });
  }
}
