import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  LucideAngularModule,
  Trash2,
  SquarePen,
  Images,
  ChartColumn,
  ChevronDown,
  FolderOpen,
  User,
  Clock,
  Calendar,
  Flag,
  FileText,
  BookOpen,
  Target,
  CheckSquare
} from 'lucide-angular';
import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { environment } from '@environments/environment';
import { FileUpload, Tabs, MetricsTableComponent } from '@shared/components';
import {
  calculateMetricsTotal,
  calculateAchievementPercentage,
  initializeMetricsMap,
  metricsMapToDto,
  parseDate,
  extractCategoryIds,
  type MetricsMap
} from '@shared/helpers';
import { ApiImgPipe } from '@shared/pipes';
import { IndicatorsStore } from '@features/admin/programs/store/indicators/indicators.store';
import { UnpaginatedSubprogramsStore } from '@features/admin/programs/store/subprograms/unpaginated-subprograms.store';
import { StaffStore } from '@features/admin/users/store/users/staff.store';
import { UnpaginatedCategoriesStore } from '../../store/categories/unpaginated-categories.store';
import { DeleteGalleryStore } from '../../store/galleries/delete-gallery.store';
import { GalleryStore } from '../../store/galleries/galeries.store';
import { AddMetricStore } from '../../store/projects/add-metric.store';
import { UpdateProjectStore } from '../../store/projects/update-project.store';
import { ProjectStore } from '../../store/projects/project.store';

@Component({
  selector: 'app-project-edit',
  templateUrl: './edit-project.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    IndicatorsStore,
    GalleryStore,
    DeleteGalleryStore,
    ProjectStore,
    UpdateProjectStore,
    UnpaginatedSubprogramsStore,
    UnpaginatedCategoriesStore,
    AddMetricStore,
    StaffStore
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    Button,
    InputText,
    DatePickerModule,
    AccordionModule,
    FileUpload,
    NgOptimizedImage,
    ApiImgPipe,
    Tabs,
    MetricsTableComponent
  ]
})
export class EditProjectComponent implements OnInit {
  #fb = inject(FormBuilder);
  #route = inject(ActivatedRoute);
  #slug = this.#route.snapshot.params['slug'];
  projectStore = inject(ProjectStore);
  galleryStore = inject(GalleryStore);
  deleteImageStore = inject(DeleteGalleryStore);
  updateProjectStore = inject(UpdateProjectStore);
  categoriesStore = inject(UnpaginatedCategoriesStore);
  programsStore = inject(UnpaginatedSubprogramsStore);
  addMetricsStore = inject(AddMetricStore);
  indicatorsStore = inject(IndicatorsStore);
  staffStore = inject(StaffStore);
  form = this.#initForm();
  metricsMap: MetricsMap = {};
  activeTab = signal('details');
  url = `${environment.apiUrl}projects/cover/`;
  galleryUrl = `${environment.apiUrl}projects/gallery/`;
  icons = {
    trash: Trash2,
    chevronDown: ChevronDown,
    folder: FolderOpen,
    user: User,
    clock: Clock,
    calendar: Calendar,
    flag: Flag,
    fileText: FileText,
    bookOpen: BookOpen,
    target: Target,
    checkSquare: CheckSquare
  } as const;
  tabs = [
    { label: "Fiche d'activité", name: 'details', icon: ChartColumn },
    { label: 'Mettre à jour', name: 'edit', icon: SquarePen },
    { label: 'Gérer la galerie', name: 'gallery', icon: Images },
    { label: 'Les indicateurs', name: 'indicators', icon: ChartColumn }
  ];
  totalTargeted = computed(() => calculateMetricsTotal(this.metricsMap, 'target'));
  totalAchieved = computed(() => calculateMetricsTotal(this.metricsMap, 'achieved'));
  achievementPercentage = computed(() => calculateAchievementPercentage(this.totalTargeted(), this.totalAchieved()));

  constructor() {
    this.#watchProjectChanges();
  }

  ngOnInit(): void {
    this.projectStore.loadProject(this.#slug);
    this.galleryStore.loadGallery(this.#slug);
  }

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

  #watchProjectChanges(): void {
    effect(() => {
      const project = this.projectStore.project();
      if (!project) return;
      const indicators = this.indicatorsStore.indicators();
      this.metricsMap = initializeMetricsMap(indicators, project.metrics);
      this.form.patchValue({
        ...project,
        started_at: parseDate(project.started_at),
        ended_at: parseDate(project.ended_at),
        program: project.program.id,
        categories: extractCategoryIds(project.categories),
        project_manager: project.project_manager?.id || null
      });
    });
  }

  onSaveMetrics(): void {
    const project = this.projectStore.project();
    if (!project) return;
    const indicators = this.indicatorsStore.indicators();
    const metrics = metricsMapToDto(this.metricsMap, indicators);
    this.addMetricsStore.addMetrics({ id: project.id, metrics });
  }

  onUpdateProject(): void {
    if (this.form.invalid) return;
    this.updateProjectStore.updateProject(this.form.value);
  }

  onCoverUploaded(): void {
    this.projectStore.loadProject(this.#slug);
  }

  onGalleryUploaded(): void {
    this.galleryStore.loadGallery(this.#slug);
  }

  onDeleteImage(id: string): void {
    this.deleteImageStore.deleteImage(id);
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }
}
