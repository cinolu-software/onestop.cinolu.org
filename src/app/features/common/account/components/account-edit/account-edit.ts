import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { Textarea } from 'primeng/textarea';
import { SelectModule, Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { LucideAngularModule, SquarePen } from 'lucide-angular';
import { FileUpload } from '@shared/components';
import { AuthStore } from '@core/auth';
import { environment } from '@environments/environment';
import { UpdateInfoStore } from '../../store/update-info.store';
import { UpdatePasswordStore } from '../../store/update-password.store';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.html',
  providers: [UpdateInfoStore, UpdatePasswordStore],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    Textarea,
    SelectModule,
    Select,
    Button,
    LucideAngularModule,
    FileUpload
  ]
})
export class AccountEditComponent implements OnInit {
  #fb = inject(FormBuilder);
  infoStore = inject(UpdateInfoStore);
  passwordStore = inject(UpdatePasswordStore);
  authStore = inject(AuthStore);
  url = environment.apiUrl + 'users/image-profile';
  genderOptions = [
    { label: 'Femme', value: 'female' },
    { label: 'Homme', value: 'male' }
  ];

  infoForm: FormGroup = this.#fb.group({
    email: ['', Validators.email],
    city: ['', Validators.required],
    country: ['', Validators.required],
    biography: [''],
    gender: ['', Validators.required],
    birth_date: ['', Validators.required],
    phone_number: ['', [Validators.minLength(10)]],
    name: ['', Validators.minLength(3)]
  });

  passwordForm: FormGroup = this.#fb.group({
    password: ['', [Validators.minLength(6), Validators.required]],
    password_confirm: ['', [Validators.minLength(6), Validators.required]]
  });

  icons = {
    edit: SquarePen
  };

  ngOnInit(): void {
    const user = this.authStore.user();
    if (!user) return;
    this.infoForm.patchValue({
      ...user,
      birth_date: user.birth_date && new Date(user.birth_date)
    });
  }

  handleLoaded(): void {
    this.authStore.getProfile();
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
