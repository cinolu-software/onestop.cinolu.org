import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { UpdateProgramStore } from '../../store/programs/update-program.store';
import { AddIndicatorStore } from '../../store/indicators/add-indicators.store';
import { UnpaginatedCategoriesStore } from '../../store/categories/unpaginated-categories.store';
import { ChartColumn, SquarePen, Check, Trash2, Funnel, Tag, Save } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '@environments/environment';
import { DatePicker } from 'primeng/datepicker';
import { ProgramStore } from '../../store/programs/program.store';
import { Tabs, FileUpload } from '@shared/components';
import { IProgram } from '@shared/models';
import { INDICATORS_CATEGORIES } from '../../data/indicators.data';
import { IndicatorFormData } from '../../types/indicator-form.type';

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
    FileUpload,
    LucideAngularModule
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
  indicatorsTab = signal<Record<string, IndicatorFormData[]>>({});
  indicatorsCategories = signal(INDICATORS_CATEGORIES);
  selectedCategory = signal(this.indicatorsCategories()[0]);
  year = signal<Date>(new Date());
  icons = {
    check: Check,
    trash: Trash2,
    filter: Funnel,
    tag: Tag,
    barChart: ChartColumn,
    save: Save
  };
  tabs = [
    { label: 'Modifier', name: 'edit', icon: SquarePen },
    { label: 'Indicateurs', name: 'indicators', icon: ChartColumn }
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

    effect(() => {
      const cat = this.selectedCategory();
      const map = this.indicatorsTab();
      if (!map[cat]) {
        this.indicatorsTab.update((m) => ({ ...m, [cat]: [{ name: '', target: null }] }));
      }
    });
  }

  #initIndicatorsTab(program: IProgram): void {
    const yearIndicators = program.indicators_grouped?.[this.year().getFullYear()];
    const grouped: Record<string, IndicatorFormData[]> = {};
    if (yearIndicators && yearIndicators.length > 0) {
      yearIndicators.forEach((indicator) => {
        const cat = indicator.category || this.selectedCategory();
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({
          indicatorId: indicator.id,
          name: indicator.name,
          target: indicator.target
        });
      });
    }
    this.indicatorsCategories().forEach((cat) => {
      if (!grouped[cat]) grouped[cat] = [{ name: '', target: null }];
    });
    this.indicatorsTab.set(grouped);
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
    const key = this.selectedCategory();
    this.indicatorsTab.update((map) => {
      const list = map[key] ? [...map[key]] : [{ name: '', target: null }];
      list.push({ indicatorId: '', name: '', target: null });
      return { ...map, [key]: list };
    });
  }

  removeIndicator(index: number): void {
    const key = this.selectedCategory();
    this.indicatorsTab.update((map) => {
      const list = map[key] ? map[key].filter((_, i) => i !== index) : [];
      return { ...map, [key]: list.length ? list : [{ name: '', target: null }] };
    });
  }

  onSaveIndicators(): void {
    const program = this.programStore.program();
    if (!program) return;
    const key = this.selectedCategory();
    const current = this.indicatorsTab()[key] ?? [];
    const validIndicators = current.filter((ind) => ind.name.trim() !== '' && ind.target !== null);
    if (!validIndicators.length) return;
    const metrics: Record<string, number>[] = validIndicators.map((indicator) => ({
      [indicator.name]: indicator.target!
    }));
    const indicators = {
      year: this.year().getFullYear(),
      category: this.selectedCategory(),
      metrics
    };
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
