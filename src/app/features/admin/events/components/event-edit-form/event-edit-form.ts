import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { IEvent } from '@shared/models';
import { extractCategoryIds, parseDate } from '@shared/helpers/form.helper';
import { UpdateEventStore } from '../../store/events/update-event.store';
import { UnpaginatedCategoriesStore } from '../../store/categories/unpaginated-categories.store';
import { UnpaginatedSubprogramsStore } from '@features/admin/programs/store/subprograms/unpaginated-subprograms.store';
import { StaffStore } from '@features/admin/users/store/users/staff.store';

@Component({
  selector: 'app-event-edit-form',
  templateUrl: './event-edit-form.html',
  providers: [UpdateEventStore, StaffStore, UnpaginatedCategoriesStore, UnpaginatedSubprogramsStore],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    DatePickerModule,
    InputText,
    Button
  ]
})
export class EventEditFormComponent {
  event = input.required<IEvent>();
  #fb = inject(FormBuilder);
  categoriesStore = inject(UnpaginatedCategoriesStore);
  programsStore = inject(UnpaginatedSubprogramsStore);
  staffStore = inject(StaffStore);
  updateEventStore = inject(UpdateEventStore);
  form = this.#initForm();

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
    if (this.form.valid) this.updateEventStore.updateEvent(this.form.value);
  }
}
