import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, RefreshCw, SquarePen, Trash, Download, Search, Plus } from 'lucide-angular';
import { UsersStore } from '../../store/users/users.store';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DownloadUsersStore } from '../../store/users/download-csv.store';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterUsersDto } from '../../dto/users/filter-users.dto';
import { ConfirmationService } from 'primeng/api';
import { DeleteUserStore } from '../../store/users/delete-user.store';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users-list',
  templateUrl: './list-users.html',
  providers: [UsersStore, DownloadUsersStore, DeleteUserStore, ConfirmationService],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    ApiImgPipe,
    AvatarModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ConfirmPopup,
    RouterLink,
  ],
})
export class ListUsers implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(UsersStore);
  deleteStore = inject(DeleteUserStore);
  downloadStore = inject(DownloadUsersStore);
  skeletonArray = Array.from({ length: 100 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    refresh: RefreshCw,
    edit: SquarePen,
    trash: Trash,
    download: Download,
    search: Search,
    plus: Plus,
  };
  queryParams = signal<FilterUsersDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q'),
  });

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || ''],
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
    this.store.loadUsers(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndUsers();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/dashboard/users'], { queryParams }).then();
  }

  updateRouteAndUsers(): void {
    this.updateRoute();
    this.loadUsers();
  }

  onDownloadUsers(): void {
    this.downloadStore.downloadUsers(this.queryParams());
  }

  onDeleteUser(userId: string, event: Event): void {
    this.#confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Etes-vous sûr ?',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger',
      },
      accept: () => {
        this.deleteStore.deleteUser(userId);
      },
    });
  }
}
