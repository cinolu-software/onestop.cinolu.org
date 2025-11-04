import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, MoveLeft } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { AddUserStore } from '../../store/users/add-user.store';
import { UnpaginatedRolesStore } from '../../store/roles/unpaginated-roles.store';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { GENDERS } from '@shared/data/genders.data';

@Component({
  selector: 'app-user-add',
  templateUrl: './add-user.html',
  providers: [AddUserStore, UnpaginatedRolesStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    AvatarModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    DatePicker,
    MultiSelectModule,
    Select,
  ],
})
export class AddUserComponent {
  #fb = inject(FormBuilder);
  addUserForm: FormGroup;
  store = inject(AddUserStore);
  rolesStore = inject(UnpaginatedRolesStore);
  icons = { back: MoveLeft };
  genders = GENDERS;

  constructor() {
    this.addUserForm = this.#fb.group({
      email: ['', [Validators.required]],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      phone_number: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      birth_date: ['', Validators.required],
      roles: [[], Validators.required],
    });
  }

  onAddUser(): void {
    this.store.addUser(this.addUserForm.value);
  }
}
