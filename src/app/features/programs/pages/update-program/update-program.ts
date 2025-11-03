import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { UpdateProgramStore } from '../../store/programs/update-program.store';
import { AddIndicatorStore } from '../../store/programs/add-indicators.store';
import { UnpaginatedCategoriesStore } from '../../store/categories/unpaginated-categories.store';
import { ChartColumn, SquarePen } from 'lucide-angular';
import { environment } from '@environments/environment';
import { DatePicker } from 'primeng/datepicker';
import { ProgramStore } from '../../store/programs/program.store';
import { Tabs, FileUpload } from '@shared/components';
import { IProgram } from '@shared/models';

interface IndicatorFormData {
  name: string;
  target: number | null;
}

@Component({
  selector: 'app-update-program-page',
  providers: [ProgramStore, UpdateProgramStore, UnpaginatedCategoriesStore, AddIndicatorStore],
  imports: [
    CommonModule,
    DatePicker,
    Tabs,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Textarea,
    FormsModule,
    Select,
    FileUpload
  ],
  templateUrl: './update-program.html'
})
export class UpdateProgram {
  #route = inject(ActivatedRoute);
  #fb = inject(FormBuilder);
  updateProgramStore = inject(UpdateProgramStore);
  categoriesStore = inject(UnpaginatedCategoriesStore);
  programStore = inject(ProgramStore);
  url = environment.apiUrl + 'programs/logo/';
  activeTab = signal('edit');
  addIndicatorStore = inject(AddIndicatorStore);
  indicatorsTab = signal<IndicatorFormData[]>([]);
  year = signal<Date>(new Date());
  selectedYear = computed(() => this.year().getFullYear());
  tabs = [
    { label: 'Modifier le projet', name: 'edit', icon: SquarePen },
    { label: 'Les indicateurs', name: 'indicators', icon: ChartColumn }
  ];
  updateForm: FormGroup = this.#fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required]
  });

  constructor() {
    const slug = this.#route.snapshot.paramMap.get('slug');
    if (!slug) return;
    this.programStore.loadProgram(slug);
    effect(() => {
      const program = this.programStore.program();
      if (!program) return;
      this.#initIndicatorsTab(program);
      this.#patchForm(program);
    });
  }

  #initIndicatorsTab(program: IProgram): void {
    const yearIndicators = program.indicators_grouped?.[this.selectedYear()];
    if (yearIndicators && yearIndicators.length > 0) {
      this.indicatorsTab.set(
        yearIndicators.map((indicator) => ({
          indicatorId: indicator.id,
          name: indicator.name,
          target: indicator.target
        }))
      );
    } else {
      this.indicatorsTab.set([{ name: '', target: null }]);
    }
  }

  #patchForm(program: IProgram): void {
    this.updateForm.patchValue({
      id: program.id || '',
      name: program.name || '',
      description: program.description || '',
      category: program.category?.id || ''
    });
  }

  addIndicator(): void {
    this.indicatorsTab.update((indicators) => [...indicators, { indicatorId: '', name: '', target: null }]);
  }

  removeIndicator(index: number): void {
    this.indicatorsTab.update((indicators) => indicators.filter((_, i) => i !== index));
  }

  onSaveIndicators(): void {
    const program = this.programStore.program();
    if (!program) return;
    const validIndicators = this.indicatorsTab().filter((ind) => ind.name.trim() !== '' && ind.target !== null);
    if (!validIndicators.length) return;
    const metrics: Record<string, number>[] = validIndicators.map((indicator) => ({
      [indicator.name]: indicator.target!
    }));
    const indicators = { year: this.selectedYear(), metrics };
    this.addIndicatorStore.addIndicator({ id: program.id, indicators });
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }

  onSubmit(): void {
    const program = this.programStore.program();
    if (this.updateForm.invalid || !program) return;
    this.updateProgramStore.updateProgram({
      programId: program.id,
      payload: this.updateForm.value
    });
  }
}
