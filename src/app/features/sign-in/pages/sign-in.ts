import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, CircleAlert } from 'lucide-angular';
import { UiInput, UiPassword, UiButton } from '@ui';
import { SignInStore } from '../store/sign-in.store';
import { AuthStore } from '@core/auth/auth.store';
import { environment } from '@env/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.html',
  providers: [SignInStore],
  imports: [ReactiveFormsModule, NgOptimizedImage, LucideAngularModule, UiInput, UiPassword, UiButton]
})
export class SignIn {
  #formBuilder: FormBuilder = inject(FormBuilder);
  form: FormGroup;
  store = inject(SignInStore);
  authStore = inject(AuthStore);
  icons = { CircleAlert };

  constructor() {
    this.form = this.#formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSignIn(): void {
    if (this.form.invalid) return;
    this.store.signIn({
      payload: this.form.value,
      onSuccess: () => true
    });
  }

  signinWithGoogle(): void {
    window.location.replace(environment.apiUrl + 'auth/sign-in');
  }
}
