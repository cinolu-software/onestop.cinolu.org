import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { UsersStore } from '../../store/users.store';
import { RolesStore } from '../../store/roles.store';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { GENDERS } from '@shared/data/genders.data';

@Component({
  selector: 'app-user-add',
  templateUrl: './add-user.html',
  providers: [UsersStore, RolesStore],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    AvatarModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    DatePicker,
    MultiSelectModule,
    Select
  ]
})
export class AddUserComponent {
  #fb = inject(FormBuilder);
  addUserForm: FormGroup;
  store = inject(UsersStore);
  rolesStore = inject(RolesStore);
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
      roles: [[], Validators.required]
    });
    this.rolesStore.loadAllRoles();
  }

  onAddUser(): void {
    this.store.addUser(this.addUserForm.value);
  }
}
