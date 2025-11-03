import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LucideAngularModule } from 'lucide-angular';
import { UpdateInfoStore } from '../../store/update-info.store';
import { UpdatePasswordStore } from '../../store/update-password.store';
import { DatePickerModule } from 'primeng/datepicker';
import { Textarea } from 'primeng/textarea';
import { FileUpload } from '@shared/components';
import { GENDERS } from '@shared/data';
import { ApiImgPipe } from '@shared/pipes';
import { AuthStore } from '@core/auth';
import { environment } from '@environments/environment';
import { SelectModule, Select } from 'primeng/select';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  providers: [UpdateInfoStore, UpdatePasswordStore],
  imports: [
    ButtonModule,
    NgOptimizedImage,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    FileUpload,
    ApiImgPipe,
    DatePickerModule,
    LucideAngularModule,
    SelectModule,
    Textarea,
    Select
  ]
})
export class Account implements OnInit {
  infoForm: FormGroup;
  passwordForm: FormGroup;
  url = environment.apiUrl + 'users/image-profile';
  #formBuilder = inject(FormBuilder);
  store = inject(AuthStore);
  infoStore = inject(UpdateInfoStore);
  passwordStore = inject(UpdatePasswordStore);
  genders = GENDERS;

  constructor() {
    this.infoForm = this.#formBuilder.group({
      email: ['', Validators.email],
      city: ['', Validators.required],
      country: ['', Validators.required],
      biography: [''],
      gender: ['', Validators.required],
      birth_date: ['', Validators.required],
      phone_number: ['', [Validators.minLength(10)]],
      name: ['', Validators.minLength(3)]
    });
    this.passwordForm = this.#formBuilder.group({
      password: ['', [Validators.minLength(6), Validators.required]],
      password_confirm: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  ngOnInit(): void {
    const user = this.store.user();
    if (!user) return;
    this.infoForm.patchValue({
      ...user,
      birth_date: user.birth_date && new Date(user.birth_date)
    });
  }

  handleLoaded(): void {
    this.store.getProfile();
  }

  onUpdateInfo(): void {
    if (!this.infoForm.valid) return;
    this.infoStore.updateInfo(this.infoForm.value);
  }

  onUpdatePassword(): void {
    if (!this.passwordForm.valid) return;
    this.passwordStore.updatePassword(this.passwordForm.value);
  }
}
