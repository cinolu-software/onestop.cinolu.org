import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../../environments/environment';
import { AuthCard } from '../../components/auth-card/auth-card';
import { SignInStore } from '../../store/sign-in.store';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.html',
  providers: [SignInStore],
  imports: [
    RouterLink,
    InputTextModule,
    Password,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    CommonModule,
    AuthCard,
  ],
})
export class SignIn {
  #formBuilder: FormBuilder = inject(FormBuilder);
  form: FormGroup;
  store = inject(SignInStore);

  constructor() {
    this.form = this.#formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSignIn(): void {
    if (this.form.invalid) return;
    this.store.signIn({
      payload: this.form.value,
      onSuccess: () => true,
    });
  }

  signinWithGoogle(): void {
    window.location.replace(environment.apiUrl + 'auth/sign-in');
  }
}
