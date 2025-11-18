import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { StepperModule } from 'primeng/stepper';
import { ProductsStore } from '../../store/products.store';
import { VenturesStore } from '@features/user/ventures/store/ventures.store';

@Component({
  selector: 'app-product-add',
  providers: [ProductsStore, VenturesStore],
  imports: [
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    DatePickerModule,
    Textarea,
    InputTextModule,
    StepperModule,
    SelectModule
  ],
  templateUrl: './add-product.html'
})
export class AddProduct {
  #fb = inject(FormBuilder);
  form: FormGroup;
  venturesStore = inject(VenturesStore);
  store = inject(ProductsStore);

  constructor() {
    this.form = this.#fb.group({
      ventureId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
    this.venturesStore.loadUnpaginatedVentures();
  }

  onAddProduct(): void {
    if (!this.form.valid) return;
    this.store.addProduct(this.form.value);
  }
}
