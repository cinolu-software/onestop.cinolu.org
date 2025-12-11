import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import {
  LucideAngularModule,
  X,
  SquarePen,
  Plus,
  Trash,
  Search,
  Funnel,
  Shield
} from 'lucide-angular';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FilterRolesDto } from '../../dto/roles/filter-roles.dto';
import { RolesStore } from '../../store/roles.store';
import { IRole } from '@shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UiButton, UiConfirmDialog } from '@shared/ui';
import { ConfirmationService } from '@shared/services/confirmation';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.html',
  providers: [RolesStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    UiButton,
    NgxPaginationModule,
    ReactiveFormsModule,
    UiConfirmDialog
  ]
})
export class UserRoles implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  searchForm: FormGroup;
  roleForm: FormGroup;
  store = inject(RolesStore);
  #destroyRef = inject(DestroyRef);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);
  icons = {
    filter: Funnel,
    x: X,
    edit: SquarePen,
    trash: Trash,
    plus: Plus,
    search: Search,
    shield: Shield
  };
  queryParams = signal<FilterRolesDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    q: this.#route.snapshot.queryParamMap.get('q')
  });
  formVisible = signal(false);
  formMode = signal<'create' | 'edit'>('create');
  editingRole = signal<IRole | null>(null);

  constructor() {
    this.searchForm = this.#fb.group({
      q: [this.queryParams().q || '']
    });
    this.roleForm = this.#fb.group({
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
        this.store.deleteRole(roleId);
      }
    });
  }

  onToggleForm(role: IRole | null = null): void {
    if (role) {
      this.formMode.set('edit');
      this.editingRole.set(role);
      this.roleForm.patchValue({
        id: role.id,
        name: role.name
      });
      this.formVisible.set(true);
      return;
    }

    this.formMode.set('create');
    this.editingRole.set(null);
    this.roleForm.reset({
      id: '',
      name: ''
    });
    this.formVisible.update((visible) => !visible);
  }

  onCancelForm(): void {
    this.formVisible.set(false);
    this.formMode.set('create');
    this.editingRole.set(null);
    this.roleForm.reset({
      id: '',
      name: ''
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;
    const { id, name } = this.roleForm.value;
    if (this.formMode() === 'edit' && id) {
      this.store.updateRole({
        payload: { id, name },
        onSuccess: () => this.onCancelForm()
      });
      return;
    }

    this.store.addRole({
      payload: { name },
      onSuccess: () => this.onCancelForm()
    });
  }
}
