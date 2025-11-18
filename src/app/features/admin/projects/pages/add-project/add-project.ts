import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsStore } from '../../store/projects.store';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CategoriesStore } from '../../store/project-categories.store';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { SubprogramsStore } from '../../../programs/store/subprograms.store';
import { UsersStore } from '@features/admin/users/store/users.store';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'app-project-add',
  templateUrl: './add-project.html',
  providers: [ProjectsStore, SubprogramsStore, CategoriesStore, UsersStore],
  imports: [
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    CommonModule,
    Button,
    InputText,
    DatePickerModule,
    ReactiveFormsModule,
    LucideAngularModule
  ]
})
export class AddProjectComponent {
  #fb = inject(FormBuilder);
  form: FormGroup;
  store = inject(ProjectsStore);
  categoriesStore = inject(CategoriesStore);
  programsStore = inject(SubprogramsStore);
  usersStore = inject(UsersStore);
  icons = {
    check: Check
  };

  constructor() {
    this.form = this.#fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      context: [''],
      objectives: [''],
      duration_hours: [null],
      selection_criteria: [''],
      started_at: [null, Validators.required],
      ended_at: [null, Validators.required],
      program: ['', Validators.required],
      categories: [[], Validators.required],
      project_manager: ['']
    });
    // Load unpaginated category options
    this.categoriesStore.loadUnpaginatedCategories();
    this.programsStore.loadUnpaginatedSubprograms();
    this.usersStore.loadStaff();
  }

  onAddProject(): void {
    if (!this.form.valid) return;
    this.store.addProject(this.form.value);
  }
}
