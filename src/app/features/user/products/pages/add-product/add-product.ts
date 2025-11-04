import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { StepperModule } from 'primeng/stepper';
import { AddProductStore } from '../../store/products/add-product.store';
import { unpaginatedVenturesStore } from '../../../ventures/store/ventures/venture-unpaginated.store';

@Component({
  selector: 'app-product-add',
  providers: [AddProductStore, unpaginatedVenturesStore],
  imports: [
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    DatePickerModule,
    Textarea,
    InputTextModule,
    StepperModule,
    SelectModule,
  ],
  templateUrl: './add-product.html',
})
export class AddProduct {
  #fb = inject(FormBuilder);
  form: FormGroup;
  venturesStore = inject(unpaginatedVenturesStore);
  store = inject(AddProductStore);

  constructor() {
    this.form = this.#fb.group({
      ventureId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onAddProduct(): void {
    if (!this.form.valid) return;
    this.store.addProduct(this.form.value);
  }
}
