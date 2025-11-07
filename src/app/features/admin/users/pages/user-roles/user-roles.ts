import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, RefreshCcw, SquarePen, Plus, Trash, Search } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { FilterRolesDto } from '../../dto/roles/filter-roles.dto';
import { AddRoleStore } from '../../store/roles/add-role.store';
import { DeleteRoleStore } from '../../store/roles/delete-role.store';
import { RolesStore } from '../../store/roles/roles.store';
import { UpdateRoleStore } from '../../store/roles/update-role.store';
import { IRole } from '@shared/models/entities.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.html',
  providers: [RolesStore, AddRoleStore, UpdateRoleStore, DeleteRoleStore, ConfirmationService],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    Dialog,
    ConfirmPopup
  ]
})
export class UserRoles implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  addRoleForm: FormGroup;
  updateRoleForm: FormGroup;
  store = inject(RolesStore);
  addRoleStore = inject(AddRoleStore);
  deleteRoleStore = inject(DeleteRoleStore);
  updateRoleStore = inject(UpdateRoleStore);
  showAddModal = signal(false);
  showEditModal = signal(false);
  #destroyRef = inject(DestroyRef);
  skeletonArray = Array.from({ length: 100 }, (_, i) => i + 1);
  icons = {
    refresh: RefreshCcw,
    edit: SquarePen,
    trash: Trash,
    plus: Plus,
    search: Search
  };
  queryParams = signal<FilterRolesDto>({
    page: this.#route.snapshot.params['page'],
    q: this.#route.snapshot.params['q']
  });

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
    this.addRoleForm = this.#fb.group({
      name: ['', Validators.required]
    });
    this.updateRoleForm = this.#fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    const searchInput = this.searchForm.get('q');
    searchInput?.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe((searchValue: string) => {
        this.queryParams().q = searchValue ? searchValue.trim() : null;
        this.queryParams().page = null;
        this.updateRouteAndRoles();
      });
  }

  loadRoles(): void {
    this.store.loadRoles(this.queryParams());
  }

  onToggleAddModal(): void {
    this.showAddModal.set(!this.showAddModal());
  }

  onToggleEditModal(role: IRole | null): void {
    this.updateRoleForm.patchValue({ ...role });
    this.showEditModal.update((v) => !v);
  }

  onPageChange(currentPage: number): void {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.updateRouteAndRoles();
  }

  updateRoute(): void {
    const queryParams = this.queryParams();
    this.#router.navigate(['/roles'], { queryParams }).then();
  }

  updateRouteAndRoles(): void {
    this.updateRoute();
    this.loadRoles();
  }

  onAddRole(): void {
    if (this.addRoleForm.invalid) return;
    this.addRoleStore.addRole({
      payload: this.addRoleForm.value,
      onSuccess: () => {
        this.onToggleAddModal();
        this.addRoleForm.reset();
      }
    });
  }

  onUpdateRole(): void {
    if (this.updateRoleForm.invalid) return;
    this.updateRoleStore.updateRole({
      payload: this.updateRoleForm.value,
      onSuccess: () => this.onToggleEditModal(null)
    });
  }

  onDeleteRole(roleId: string, event: Event): void {
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
        this.deleteRoleStore.deleteRole(roleId);
      }
    });
  }
}
