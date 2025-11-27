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
import { ProjectsStore } from '../../store/projects.store';
import { CategoriesStore } from '../../store/project-categories.store';
import { SubprogramsStore } from '@features/admin/programs/store/subprograms.store';
import { UsersStore } from '@features/admin/users/store/users.store';

@Component({
  selector: 'app-project-edit-form',
  templateUrl: './project-edit-form.html',
  providers: [ProjectsStore, UsersStore, CategoriesStore, SubprogramsStore],
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
  categoriesStore = inject(CategoriesStore);
  programsStore = inject(SubprogramsStore);
  usersStore = inject(UsersStore);
  updateProjectStore = inject(ProjectsStore);
  form = this.#initForm();
  #lastLoadedProgramId: string | null = null;

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
      const project = this.project();
      if (!project) return;
      this.#patchForm(project);
      const parentProgramId = project.program?.program?.id;
      if (!parentProgramId || parentProgramId === this.#lastLoadedProgramId) return;
      this.#lastLoadedProgramId = parentProgramId;
      this.programsStore.loadUnpaginatedSubprograms(parentProgramId);
    });
    this.categoriesStore.loadUnpaginatedCategories();
    this.usersStore.loadStaff();
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
