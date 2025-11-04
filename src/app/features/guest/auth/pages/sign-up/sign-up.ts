import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthCard } from '../../components/auth-card/auth-card';
import { SignUpStore } from '../../store/sign-up.store';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { COUNTRY_CODE } from '../../../../shared/data/country-item.data';
import { GENDERS } from '../../../../shared/data/genders.data';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  providers: [SignUpStore],
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    AuthCard,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    PasswordModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
  ],
})
export class SignUp {
  #formBuilder: FormBuilder = inject(FormBuilder);
  #route = inject(ActivatedRoute);
  form: FormGroup;
  store = inject(SignUpStore);
  genderItems = GENDERS;
  countryItems = COUNTRY_CODE;
  selectedCountryCode = '';
  ref = this.#route.snapshot.queryParams['ref'] || null;

  constructor() {
    this.form = this.#formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required, Validators.minLength(6)]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  onSignUp(): void {
    if (this.form.invalid) return;
    this.store.signUp({
      ...this.form.value,
      referral_code: this.ref,
      phone_number: this.selectedCountryCode + this.form.value.phone_number,
      birth_date: new Date(this.form.value.birth_date),
    });
  }

  onSelectCountry(event: SelectChangeEvent): void {
    const value = event.value;
    this.selectedCountryCode = this.countryItems.find((item) => item.name === value)?.code || '';
  }
}
