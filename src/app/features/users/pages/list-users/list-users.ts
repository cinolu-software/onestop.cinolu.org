import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { LucideAngularModule, X, SquarePen, Trash, Download, Search, Plus } from 'lucide-angular';
import { UsersStore } from '../../store/users.store';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterUsersDto } from '../../dto/users/filter-users.dto';

import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiAvatar, UiButton, UiConfirmDialog } from '@shared/ui';
import { ConfirmationService } from '@shared/services/confirmation';

@Component({
  selector: 'app-users-list',
  templateUrl: './list-users.html',
  providers: [UsersStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    UiButton,
    ApiImgPipe,
    UiAvatar,
    NgxPaginationModule,
    ReactiveFormsModule,
    UiConfirmDialog,
    RouterLink
  ]
})
export class ListUsers implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  store = inject(UsersStore);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
  #destroyRef = inject(DestroyRef);
  icons = {
    x: X,
    edit: SquarePen,
    trash: Trash,
    download: Download,
    search: Search,
    plus: Plus
  };
  queryParams = signal<FilterUsersDto>({
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
    this.store.loadUsers(this.queryParams());
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndUsers();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/users'], { queryParams }).then();
  }

  updateRouteAndUsers(): void {
    this.updateRoute();
    this.loadUsers();
  }

  onDownloadUsers(): void {
    this.store.downloadUsers(this.queryParams());
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
        this.store.deleteUser(userId);
      }
    });
  }
}
