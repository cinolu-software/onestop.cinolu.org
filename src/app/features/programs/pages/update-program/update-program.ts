import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { IndicatorsStore } from '../../store/indicators.store';
import { ProgramsStore } from '../../store/programs.store';
import { ProgramCategoriesStore } from '../../store/program-categories.store';
import { ChartColumn, SquarePen, Check, Trash2, Funnel, Tag, Save } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../../environments/environment';
import { UiTabs, FileUpload } from '@shared/ui';
import { IProgram } from '@shared/models';
import { INDICATORS_CATEGORIES } from '../../data/indicators.data';
import { IndicatorFormData } from '../../types/indicator-form.type';
import { ListSubprograms } from '../../components/subprograms/subprograms';
import { UiButton, UiSelect } from '@shared/ui';
import { SelectOption } from '@shared/ui/form/select/select';

@Component({
  selector: 'app-update-program-page',
  providers: [ProgramsStore, IndicatorsStore, ProgramCategoriesStore],
  imports: [
    CommonModule,
    UiTabs,
    ReactiveFormsModule,
    UiButton,
    FormsModule,
    UiSelect,
    FileUpload,
    LucideAngularModule,
    ListSubprograms
  ],
  templateUrl: './update-program.html'
})
export class UpdateProgram {
  #route = inject(ActivatedRoute);
  #fb = inject(FormBuilder);
  store = inject(ProgramsStore);

  categoriesStore = inject(ProgramCategoriesStore);
  url = environment.apiUrl + 'programs/logo/';
  activeTab = signal('edit');
  indicatorsStore = inject(IndicatorsStore);
  indicatorsTab = signal<Record<string, IndicatorFormData[]>>({});
  indicatorsCategories = signal(INDICATORS_CATEGORIES);
  selectedCategory = signal(this.indicatorsCategories()[0]);
  year = signal<Date>(new Date());

  categoryOptions = computed<SelectOption[]>(() =>
    this.categoriesStore.allCategories().map((cat) => ({
      label: cat.name,
      value: cat.id
    }))
  );

  indicatorCategoryOptions = computed<SelectOption[]>(() =>
    this.indicatorsCategories().map((cat) => ({
      label: cat,
      value: cat
    }))
  );

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
    { label: 'Sous programmes', name: 'subprograms', icon: Tag },
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
    this.store.loadProgram(slug);
    // Load categories via ProgramCategoriesStore
    this.categoriesStore.loadUnpaginatedCategories();
    effect(() => {
      const program = this.store.program();
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
    const program = this.store.program();
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
    this.indicatorsStore.addIndicator({ id: program.id, indicators });
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }

  onSubmit(): void {
    const program = this.store.program();
    if (this.updateForm.invalid || !program) return;
    this.store.updateProgram({
      programId: program.id,
      payload: this.updateForm.value
    });
  }
}
