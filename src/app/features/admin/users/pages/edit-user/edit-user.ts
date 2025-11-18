import { Component, effect, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, Locate, TriangleAlert, Phone, Mail, User, Calendar, MapPin } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersStore } from '../../store/users.store';
import { MultiSelectModule } from 'primeng/multiselect';
import { RolesStore } from '../../store/roles.store';
import { DatePickerModule } from 'primeng/datepicker';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { SelectModule } from 'primeng/select';
import { GENDERS } from '@shared/data/genders.data';
import { TabsModule } from 'primeng/tabs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './edit-user.html',
  providers: [UsersStore, RolesStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    AvatarModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    ApiImgPipe,
    DatePickerModule,
    MultiSelectModule,
    SelectModule,
    TabsModule
  ]
})
export class EditUser {
  #fb = inject(FormBuilder);
  #location = inject(Location);
  genders = GENDERS;
  updateUserForm: FormGroup;
  store = inject(UsersStore);
  rolesStore = inject(RolesStore);
  #route = inject(ActivatedRoute);
  icons = {
    locate: Locate,
    alert: TriangleAlert,
    phone: Phone,
    email: Mail,
    user: User,
    calendar: Calendar,
    mapPin: MapPin
  };

  constructor() {
    this.updateUserForm = this.#fb.group({
      id: ['', Validators.required],
      email: ['', [Validators.required]],
      name: ['', Validators.required],
      phone_number: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      birth_date: ['', Validators.required],
      roles: [[], Validators.required]
    });
    const email = this.#route.snapshot.params['email'];
    if (email) this.store.loadUser(email);
    this.rolesStore.loadAllRoles();
    effect(() => {
      const user = this.store.user();
      if (!user) return;
      this.updateUserForm.patchValue({
        ...user,
        birth_date: user.birth_date ? new Date(user.birth_date) : '',
        roles: user.roles.map((role) => role.id)
      });
    });
  }

  onUpdateUser(): void {
    this.store.updateUser(this.updateUserForm.value);
  }

  onGoBack(): void {
    this.#location.back();
  }
}
