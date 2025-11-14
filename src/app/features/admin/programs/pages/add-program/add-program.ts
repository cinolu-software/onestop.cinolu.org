import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { LucideAngularModule, CircleAlert } from 'lucide-angular';
import { AddProgramStore } from '../../store/programs/add-program.store';
import { UnpaginatedCategoriesStore } from '../../store/categories/unpaginated-categories.store';
import { ProgramDto } from '../../dto/programs/program.dto';

@Component({
  selector: 'app-add-program',
  providers: [AddProgramStore, UnpaginatedCategoriesStore],
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Textarea, Select, LucideAngularModule],
  templateUrl: './add-program.html'
})
export class AddProgramPage {
  #fb = inject(FormBuilder);
  addProgramStore = inject(AddProgramStore);
  categoriesStore = inject(UnpaginatedCategoriesStore);
  icons = { alert: CircleAlert };

  form = this.#fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.addProgramStore.addProgram(this.form.value as ProgramDto);
  }
}
