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
  StarOff
} from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventsStore } from '../../store/events/events.store';
import { ConfirmationService } from 'primeng/api';
import { DeleteEventStore } from '../../store/events/delete-event.store';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { AvatarModule } from 'primeng/avatar';
import { PublishEventStore } from '../../store/events/publish-event.store';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { HighlightEventStore } from '../../store/events/highlight-event.store';
import { FilterEventsDto } from '../../dto/categories/filter-events.dto';
import { ProgressSpinner } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-events-list',
  templateUrl: './list-events.html',
  providers: [EventsStore, PublishEventStore, DeleteEventStore, ConfirmationService, HighlightEventStore],
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
    ProgressSpinner
  ]
})
export class ListEvents implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(EventsStore);
  deleteEventStore = inject(DeleteEventStore);
  publishEventStore = inject(PublishEventStore);
  highlightStore = inject(HighlightEventStore);
  skeletonArray = Array.from({ length: 100 }, (_, i) => i + 1);
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
    starOff: StarOff
  };
  queryParams = signal<FilterEventsDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q')
  });

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

  loadEvents(): void {
    this.store.loadEvents(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndEvents();
  }

  async updateRoute(): Promise<void> {
    const queryParams = this.queryParams();
    await this.#router.navigate(['/events'], { queryParams });
  }

  highlightEvent(eventId: string): void {
    this.highlightStore.highlight(eventId);
  }

  updateRouteAndEvents(): void {
    this.updateRoute().then();
    this.loadEvents();
  }

  onPublishProject(projectId: string): void {
    this.publishEventStore.publishEvent(projectId);
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
        this.deleteEventStore.deleteEvent(projectId);
      }
    });
  }
}
