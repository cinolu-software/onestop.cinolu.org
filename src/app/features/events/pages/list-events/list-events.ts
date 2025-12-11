import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  LucideAngularModule,
  X,
  SquarePen,
  Trash,
  Search,
  Plus,
  Eye,
  EyeOff,
  Star,
  StarOff,
  FileX,
  Sparkles,
  Funnel
} from 'lucide-angular';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventsStore } from '../../store/events.store';

import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { FilterEventsDto } from '../../dto/categories/filter-events.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { IndicatorsStore } from '@features/programs/store/indicators.store';
import { UiAvatar, UiButton, UiConfirmDialog, UiTabs } from '@shared/ui';
import { ConfirmationService } from '@shared/services/confirmation';

@Component({
  selector: 'app-events-list',
  templateUrl: './list-events.html',
  providers: [EventsStore, IndicatorsStore],
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
export class ListEvents implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  eventsStore = inject(EventsStore);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    x: X,
    edit: SquarePen,
    trash: Trash,
    search: Search,
    plus: Plus,
    eye: Eye,
    eyeOff: EyeOff,
    star: Star,
    starOff: StarOff,
    filter: Funnel,
    fileX: FileX,
    sparkles: Sparkles
  };
  queryParams = signal<FilterEventsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q'),
    filter: (this.#route.snapshot.queryParamMap.get('filter') as FilterEventsDto['filter']) || 'all'
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
    this.loadEvents();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndEvents();
      });
  }

  onTabChange(tabName: string): void {
    this.activeTab.set(tabName);
    this.queryParams().filter = tabName as FilterEventsDto['filter'];
    this.queryParams().page = null;
    this.updateRouteAndEvents();
  }

  loadEvents(): void {
    this.eventsStore.loadEvents(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndEvents();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/events'], { queryParams });
  }

  highlightEvent(eventId: string): void {
    this.eventsStore.highlight(eventId);
  }

  updateRouteAndEvents(): void {
    this.updateRoute();
    this.loadEvents();
  }

  onPublishProject(projectId: string): void {
    this.eventsStore.publishEvent(projectId);
  }

  onDeleteProject(projectId: string, event: Event): void {
    this.#confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Etes-vous sûr ?',
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        severity: 'danger'
      },
      acceptLabel: 'Confirmer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.eventsStore.deleteEvent(projectId);
      }
    });
  }
}
