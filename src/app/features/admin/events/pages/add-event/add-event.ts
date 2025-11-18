import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventsStore } from '../../store/events.store';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { SubprogramsStore } from '@features/admin/programs/store/subprograms.store';
import { UsersStore } from '@features/admin/users/store/users.store';
import { CategoriesStore } from '../../store/event-categories.store';

@Component({
  selector: 'app-event-add',
  templateUrl: './add-event.html',
  providers: [EventsStore, SubprogramsStore, UsersStore],
  imports: [
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    CommonModule,
    Button,
    InputText,
    DatePickerModule,
    ReactiveFormsModule
  ]
})
export class AddEventComponent {
  #fb = inject(FormBuilder);
  form: FormGroup;
  eventsStore = inject(EventsStore);
  categoriesStore = inject(CategoriesStore);
  programsStore = inject(SubprogramsStore);
  usersStore = inject(UsersStore);

  constructor() {
    this.form = this.#fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      place: [''],
      context: [''],
      objectives: [''],
      duration_hours: [null],
      selection_criteria: [''],
      started_at: [null, Validators.required],
      ended_at: [null, Validators.required],
      program: ['', Validators.required],
      categories: [[], Validators.required],
      event_manager: ['']
    });
    this.categoriesStore.loadUnpaginatedCategories();
    this.programsStore.loadUnpaginatedSubprograms();
    this.usersStore.loadStaff();
  }

  onAddEvent(): void {
    if (!this.form.valid) return;
    this.eventsStore.addEvent(this.form.value);
  }
}
