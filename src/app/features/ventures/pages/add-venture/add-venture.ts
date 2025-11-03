import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { StepperModule } from 'primeng/stepper';
import { SECTORS } from '../../data/sectors.data';
import { STAGES } from '../../data/stage.data';
import { AddVentureStore } from '../../store/ventures/add-venture.store';

@Component({
  selector: 'app-venture-add',
  providers: [AddVentureStore],
  imports: [
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    DatePickerModule,
    Textarea,
    InputTextModule,
    StepperModule,
  ],
  templateUrl: './add-venture.html',
})
export class AddVenture {
  #fb = inject(FormBuilder);
  form: FormGroup;
  sectors = SECTORS;
  stages = STAGES;
  store = inject(AddVentureStore);

  constructor() {
    this.form = this.#fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      problem_solved: ['', Validators.required],
      target_market: ['', Validators.required],
      email: ['', Validators.email],
      phone_number: [''],
      website: [''],
      linkedin_url: [''],
      sector: [''],
      founded_at: [''],
      location: [''],
      stage: [''],
    });
  }

  onAddVenture(): void {
    if (!this.form.valid) return;
    this.store.addVenture(this.form.value);
  }
}
