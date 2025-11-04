import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, RefreshCw, SquarePen, Trash, Download, Search, Plus, UserLock } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EntrepreneursStore } from '../../store/entrepreneurs.store';
import { DownloadUsersStore } from '@features/admin/users/store/users/download-csv.store';
import { DeleteUserStore } from '@features/admin/users/store/users/delete-user.store';
import { FilterEntrepreneursDto } from '../../dto/ventures/filter-ventures.dto';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ApiImgPipe } from '@shared/pipes';

@Component({
  selector: 'app-users-list',
  templateUrl: './list-entrepreneurs.html',
  providers: [DownloadUsersStore, DeleteUserStore, ConfirmationService, EntrepreneursStore],
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
    ApiImgPipe
  ]
})
export class ListEntrepreneurs implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(EntrepreneursStore);
  deleteStore = inject(DeleteUserStore);
  skeletonArray = Array.from({ length: 100 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    refresh: RefreshCw,
    edit: SquarePen,
    trash: Trash,
    download: Download,
    search: Search,
    plus: Plus,
    lock: UserLock
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
    this.loadUsers();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndUsers();
      });
  }

  loadUsers(): void {
    this.store.loadEntrepreneurs();
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndUsers();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/dashboard/entrepreneurs'], { queryParams }).then();
  }

  updateRouteAndUsers(): void {
    this.updateRoute();
    this.loadUsers();
  }

  onDeleteUser(userId: string, event: Event): void {
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
        this.deleteStore.deleteUser(userId);
      }
    });
  }
}
