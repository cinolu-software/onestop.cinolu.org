import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  LucideAngularModule,
  Plus,
  RefreshCw,
  SquareCheck,
  SquarePen,
  Trash
} from 'lucide-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';
import { DownloadUsersStore } from '@features/users/store/users/download-csv.store';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterEntrepreneursDto } from '../../dto/ventures/filter-ventures.dto';
import { DeleteVentureStore } from '../../store/delete-venture.store';
import { VenturesStore } from '../../store/ventures.store';
import { SECTORS } from '@features/ventures/data/sectors.data';
import { Select } from 'primeng/select';
import { PublishVentureStore } from '../../store/publish-venture.store';
import { IVenture } from '@shared/models';
import { ApiImgPipe } from '@shared/pipes';

@Component({
  selector: 'app-list-ventures',
  providers: [DownloadUsersStore, ConfirmationService, DeleteVentureStore, VenturesStore, PublishVentureStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    AvatarModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ConfirmPopup,
    RouterLink,
    ApiImgPipe,
    Select
  ],
  templateUrl: './list-ventures.html'
})
export class ListVentures implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  #destroyRef = inject(DestroyRef);
  pulishStore = inject(PublishVentureStore);
  sectors = SECTORS;
  store = inject(VenturesStore);
  deleteStore = inject(DeleteVentureStore);
  searchForm: FormGroup;

  skeletonArray = Array.from({ length: 40 }, (_, i) => i + 1);
  icons = {
    refresh: RefreshCw,
    edit: SquarePen,
    trash: Trash,
    download: Download,
    plus: Plus,
    squaredCheck: SquareCheck,
    chevronDown: ChevronDown,
    chevronRight: ChevronRight,
    eyeOff: EyeOff,
    eyeOpen: Eye
  };

  queryParams = signal<FilterEntrepreneursDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q')
  });

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
  }

  ngOnInit(): void {
    this.loadVentures();

    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue?.trim() || null;
        this.queryParams().page = null;
        this.updateRouteAndVentures();
      });
  }

  loadVentures(): void {
    this.store.loadVentures(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndVentures();
  }

  async updateRoute(): Promise<void> {
    const queryParams = this.queryParams();
    await this.#router.navigate(['/dashboard/entrepreneurs/ventures'], { queryParams });
  }

  onDeleteVenture(ventureId: string, event: Event): void {
    this.#confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Êtes-vous sûr de vouloir supprimer cette entreprise ?',
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
        this.deleteStore.deleteVenture(ventureId);
      }
    });
  }

  updateRouteAndVentures(): void {
    this.updateRoute().then();
    this.loadVentures();
  }

  sectorColor(sector: string): string {
    const s = sector?.toLowerCase() ?? '';
    if (s.includes('agro')) return 'linear-gradient(to right, #22c55e, #16a34a)';
    if (s.includes('finance')) return 'linear-gradient(to right, #3b82f6, #1d4ed8)';
    if (s.includes('industrie')) return 'linear-gradient(to right, #facc15, #eab308)';
    if (s.includes('médias') || s.includes('media')) return 'linear-gradient(to right, #8b5cf6, #7c3aed)';
    if (s.includes('tech')) return 'linear-gradient(to right, #0ea5e9, #0284c7)';
    return 'linear-gradient(to right, #9ca3af, #6b7280)';
  }

  expandedMenu = signal<string | null>(null);

  toggleExpand(id: string) {
    this.expandedMenu.update((current) => (current === id ? null : id));
  }

  isPublished(venture: IVenture): boolean {
    return venture.is_published;
  }

  onPublishVenture(ventureSlug: string, event: Event): void {
    this.pulishStore.publishVenture(ventureSlug);
    event.stopPropagation();
  }
}
