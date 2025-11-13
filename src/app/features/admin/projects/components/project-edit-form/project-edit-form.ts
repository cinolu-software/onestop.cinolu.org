import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { IProject } from '@shared/models';
import { extractCategoryIds, parseDate } from '@shared/helpers/form.helper';
import { UpdateProjectStore } from '../../store/projects/update-project.store';
import { UnpaginatedCategoriesStore } from '../../store/categories/unpaginated-categories.store';
import { UnpaginatedSubprogramsStore } from '@features/admin/programs/store/subprograms/unpaginated-subprograms.store';
import { StaffStore } from '@features/admin/users/store/users/staff.store';

@Component({
  selector: 'app-project-edit-form',
  templateUrl: './project-edit-form.html',
  providers: [UpdateProjectStore, StaffStore, UnpaginatedCategoriesStore, UnpaginatedSubprogramsStore],
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
export class ProjectEditFormComponent {
  project = input.required<IProject>();
  #fb = inject(FormBuilder);
  categoriesStore = inject(UnpaginatedCategoriesStore);
  programsStore = inject(UnpaginatedSubprogramsStore);
  staffStore = inject(StaffStore);
  updateProjectStore = inject(UpdateProjectStore);
  form = this.#initForm();

  #initForm(): FormGroup {
    return this.#fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      context: [''],
      objectives: [''],
      duration_hours: [null],
      selection_criteria: [''],
      started_at: ['', Validators.required],
      ended_at: ['', Validators.required],
      program: ['', Validators.required],
      categories: [[], Validators.required],
      project_manager: [null]
    });
  }

  constructor() {
    effect(() => {
      this.#patchForm(this.project());
    });
  }

  #patchForm(project: IProject): void {
    this.form.patchValue({
      ...project,
      started_at: parseDate(project.started_at),
      ended_at: parseDate(project.ended_at),
      program: project.program.id,
      categories: extractCategoryIds(project.categories),
      project_manager: project.project_manager?.id || null
    });
  }

  onSubmit(): void {
    if (this.form.valid) this.updateProjectStore.updateProject(this.form.value);
  }
}
