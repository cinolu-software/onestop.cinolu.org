import { Component, effect, inject, OnInit, signal, computed } from '@angular/core';
import { Button } from 'primeng/button';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { ActivatedRoute } from '@angular/router';
import {
  ChartColumn,
  Images,
  LucideAngularModule,
  SquarePen,
  Trash2,
  ChevronDown,
  FolderOpen,
  User,
  Clock,
  Calendar,
  Flag,
  FileText,
  BookOpen,
  Target,
  MapPin,
  SquareCheckBig
} from 'lucide-angular';
import { environment } from '@environments/environment';
import { FileUpload, Tabs, MetricsTableComponent } from '@shared/components';
import {
  MetricsMap,
  calculateMetricsTotal,
  calculateAchievementPercentage,
  parseDate,
  extractCategoryIds,
  initializeMetricsMap,
  metricsMapToDto
} from '@shared/helpers';
import { IEvent } from '@shared/models';
import { ApiImgPipe } from '@shared/pipes';
import { IndicatorsStore } from '@features/admin/programs/store/indicators/indicators.store';
import { UnpaginatedSubprogramsStore } from '@features/admin/programs/store/subprograms/unpaginated-subprograms.store';
import { StaffStore } from '@features/admin/users/store/users/staff.store';
import { UnpaginatedCategoriesStore } from '../../store/categories/unpaginated-categories.store';
import { AddMetricStore } from '../../store/events/add-metric.store';
import { UpdateEventStore } from '../../store/events/update-event.store';
import { DeleteGalleryStore } from '../../store/galleries/delete-gallery.store';
import { GalleryStore } from '../../store/galleries/galeries.store';
import { EventStore } from '../../store/events/event.store';
import { EventsPublishStore } from '../../store/events/events-publish-params.store';

@Component({
  selector: 'app-event-edit',
  templateUrl: './edit-event.html',
  providers: [
    IndicatorsStore,
    EventsPublishStore,
    EventStore,
    GalleryStore,
    DeleteGalleryStore,
    UpdateEventStore,
    UnpaginatedSubprogramsStore,
    UnpaginatedCategoriesStore,
    AddMetricStore,
    StaffStore
  ],
  imports: [
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    CommonModule,
    FormsModule,
    Button,
    InputText,
    DatePickerModule,
    ReactiveFormsModule,
    FileUpload,
    NgOptimizedImage,
    ApiImgPipe,
    LucideAngularModule,
    Tabs,
    MetricsTableComponent
  ]
})
export class EditEventComponent implements OnInit {
  #fb = inject(FormBuilder);
  #route = inject(ActivatedRoute);
  #slug = this.#route.snapshot.params['slug'];
  store = inject(UpdateEventStore);
  categoriesStore = inject(UnpaginatedCategoriesStore);
  programsStore = inject(UnpaginatedSubprogramsStore);
  eventStore = inject(EventStore);
  indicatorsStore = inject(IndicatorsStore);
  deleteGalleryStore = inject(DeleteGalleryStore);
  galleryStore = inject(GalleryStore);
  addMetricsStore = inject(AddMetricStore);
  staffStore = inject(StaffStore);
  form!: FormGroup;
  metricsMap: MetricsMap = {};
  activeTab = signal('details');
  url = `${environment.apiUrl}events/cover/`;
  galleryUrl = `${environment.apiUrl}events/gallery/`;
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
    checkSquare: SquareCheckBig,
    mapPin: MapPin
  };
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
    this.form = this.#initForm();
    this.#watchEventChanges();
  }

  ngOnInit(): void {
    this.eventStore.loadEvent(this.#slug);
    this.galleryStore.loadGallery(this.#slug);
  }

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

  #watchEventChanges(): void {
    effect(() => {
      const event = this.eventStore.event();
      if (!event) return;
      this.#patchForm(event);
      this.#initMetrics(event);
    });
  }

  #initMetrics(event: IEvent): void {
    const indicators = this.indicatorsStore.indicators();
    this.metricsMap = initializeMetricsMap(indicators, event.metrics);
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }

  onUpdateEvent(): void {
    if (!this.form.valid) return;
    this.store.updateEvent(this.form.value);
  }

  onDeleteImage(imageId: string): void {
    this.deleteGalleryStore.deleteImage(imageId);
  }

  onCoverUploaded(): void {
    this.eventStore.loadEvent(this.#slug);
  }

  onGalleryUploaded(): void {
    this.galleryStore.loadGallery(this.#slug);
  }

  onSaveMetrics(): void {
    const event = this.eventStore.event();
    if (!event) return;
    const indicators = this.indicatorsStore.indicators();
    const metrics = metricsMapToDto(this.metricsMap, indicators);
    this.addMetricsStore.addMetrics({ id: event.id, metrics });
  }
}
