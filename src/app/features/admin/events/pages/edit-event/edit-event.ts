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
import { QuillEditorComponent } from 'ngx-quill';
import { ChartColumn, Images, LucideAngularModule, SquarePen, Trash2 } from 'lucide-angular';
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
import { IndicatorsStore } from '@features/programs/store/programs/indicators.store';
import { UnpaginatedSubprogramsStore } from '@features/programs/store/subprograms/unpaginated-subprograms.store';
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
    AddMetricStore
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
    QuillEditorComponent,
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
  form!: FormGroup;
  metricsMap: MetricsMap = {};
  activeTab = signal('edit');

  url = `${environment.apiUrl}events/cover/`;
  galleryUrl = `${environment.apiUrl}events/gallery/`;
  icons = { trash: Trash2 };
  tabs = [
    { label: "Modifier l'événement", name: 'edit', icon: SquarePen },
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
      form_link: [''],
      started_at: ['', Validators.required],
      ended_at: ['', Validators.required],
      program: ['', Validators.required],
      categories: [[], Validators.required]
    });
  }

  #patchForm(event: IEvent): void {
    this.form.patchValue({
      ...event,
      started_at: parseDate(event.started_at),
      ended_at: parseDate(event.ended_at),
      program: event.program.id,
      categories: extractCategoryIds(event.categories)
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
