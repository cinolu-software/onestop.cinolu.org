import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { LucideAngularModule, CircleAlert } from 'lucide-angular';
import { ProgramsStore } from '../../store/programs.store';
import { ProgramDto } from '../../dto/programs/program.dto';
import { CategoriesStore } from '@features/admin/projects/store/project-categories.store';

@Component({
  selector: 'app-add-program',
  providers: [ProgramsStore, CategoriesStore],
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Textarea, Select, LucideAngularModule],
  templateUrl: './add-program.html'
})
export class AddProgramPage {
  #fb = inject(FormBuilder);
  store = inject(ProgramsStore);
  categoriesStore = inject(CategoriesStore);
  icons = { alert: CircleAlert };
  form = this.#fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.addProgram(this.form.value as ProgramDto);
  }

  constructor() {
    this.categoriesStore.loadUnpaginatedCategories();
  }
}
