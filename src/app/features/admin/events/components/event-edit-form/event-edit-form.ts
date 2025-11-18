import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save } from 'lucide-angular';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { IEvent } from '@shared/models';
import { extractCategoryIds, parseDate } from '@shared/helpers/form.helper';
import { EventsStore } from '../../store/events.store';
import { SubprogramsStore } from '@features/admin/programs/store/subprograms.store';
import { UsersStore } from '@features/admin/users/store/users.store';
import { CategoriesStore } from '../../store/event-categories.store';

@Component({
  selector: 'app-event-edit-form',
  templateUrl: './event-edit-form.html',
  providers: [EventsStore, CategoriesStore, UsersStore, SubprogramsStore],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    DatePickerModule,
    InputText,
    Button,
    LucideAngularModule
  ]
})
export class EventEditFormComponent {
  event = input.required<IEvent>();
  #fb = inject(FormBuilder);
  store = inject(EventsStore);
  categoriesStore = inject(CategoriesStore);
  programsStore = inject(SubprogramsStore);
  usersStore = inject(UsersStore);
  form = this.#initForm();
  icons = {
    save: Save
  };

  #initForm(): FormGroup {
    return this.#fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      place: [''],
      description: ['', Validators.required],
      context: [''],
      objectives: [''],
      duration_hours: [null],
      selection_criteria: [''],
      started_at: ['', Validators.required],
      ended_at: ['', Validators.required],
      program: ['', Validators.required],
      categories: [[], Validators.required],
      event_manager: ['']
    });
  }

  constructor() {
    effect(() => {
      this.#patchForm(this.event());
    });
    this.categoriesStore.loadUnpaginatedCategories();
    this.programsStore.loadUnpaginatedSubprograms();
    this.usersStore.loadStaff();
  }

  #patchForm(event: IEvent): void {
    this.form.patchValue({
      ...event,
      started_at: parseDate(event.started_at),
      ended_at: parseDate(event.ended_at),
      program: event.program.id,
      categories: extractCategoryIds(event.categories),
      event_manager: event.event_manager?.id ?? ''
    });
  }

  onSubmit(): void {
    if (this.form.valid) this.store.updateEvent(this.form.value);
  }
}
