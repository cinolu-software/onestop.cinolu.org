import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthCard } from '../../components/auth-card/auth-card';
import { ForgotPasswordStore } from '../../store/forgot-password.store';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  providers: [ForgotPasswordStore],
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    ButtonModule,
    InputText,
    RouterModule,
    CommonModule,
    AuthCard,
  ],
})
export class ForgotPassword {
  #formBuilder = inject(FormBuilder);
  form: FormGroup;
  store = inject(ForgotPasswordStore);

  constructor() {
    this.form = this.#formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onForgotPassword(): void {
    if (!this.form.invalid) {
      this.form.disable();
      this.store.forgotPassword(this.form.value);
      this.form.enable();
    }
  }
}
