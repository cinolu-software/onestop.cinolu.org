import { Component, effect, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChartColumn, SquarePen, Images } from 'lucide-angular';
import { Tabs, MetricsTableComponent } from '@shared/components';
import { MetricsMap, totalMetrics, achievementPercentage, metricsMap, metricsMapToDto } from '@shared/helpers';
import { IEvent } from '@shared/models';
import { IndicatorsStore } from '@features/admin/programs/store/indicators/indicators.store';
import { AddMetricStore } from '../../store/events/add-metric.store';
import { DeleteGalleryStore } from '../../store/galleries/delete-gallery.store';
import { GalleryStore } from '../../store/galleries/galeries.store';
import { EventStore } from '../../store/events/event.store';
import { EventDetailsComponent } from '../../components/event-details/event-details';
import { EventGalleryComponent } from '../../components/event-gallery/event-gallery';
import { EventEditFormComponent } from '../../components/event-edit-form/event-edit-form';
import { EventDetailsSkeletonComponent } from '../../components/event-details-skeleton/event-details-skeleton';

@Component({
  selector: 'app-event-edit',
  templateUrl: './edit-event.html',
  providers: [IndicatorsStore, EventStore, GalleryStore, DeleteGalleryStore, AddMetricStore],
  imports: [
    CommonModule,
    Tabs,
    MetricsTableComponent,
    EventDetailsComponent,
    EventGalleryComponent,
    EventEditFormComponent,
    EventDetailsSkeletonComponent
  ]
})
export class EditEventComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #slug = this.#route.snapshot.params['slug'];
  eventStore = inject(EventStore);
  indicatorsStore = inject(IndicatorsStore);
  deleteGalleryStore = inject(DeleteGalleryStore);
  galleryStore = inject(GalleryStore);
  addMetricsStore = inject(AddMetricStore);
  metricsMap: MetricsMap = {};
  activeTab = signal('details');
  tabs = [
    { label: "Fiche d'activité", name: 'details', icon: ChartColumn },
    { label: 'Mettre à jour', name: 'edit', icon: SquarePen },
    { label: 'Gérer la galerie', name: 'gallery', icon: Images },
    { label: 'Les indicateurs', name: 'indicators', icon: ChartColumn }
  ];
  totalTargeted = computed(() => totalMetrics(this.metricsMap, 'target'));
  totalAchieved = computed(() => totalMetrics(this.metricsMap, 'achieved'));
  achievementPercentage = computed(() => achievementPercentage(this.totalTargeted(), this.totalAchieved()));

  constructor() {
    this.#watchEventChanges();
  }

  ngOnInit(): void {
    this.eventStore.loadEvent(this.#slug);
    this.galleryStore.loadGallery(this.#slug);
  }

  #watchEventChanges(): void {
    effect(() => {
      const event = this.eventStore.event();
      if (!event) return;
      this.#initMetrics(event);
    });
  }

  #initMetrics(event: IEvent): void {
    const indicators = this.indicatorsStore.indicators();
    this.metricsMap = metricsMap(indicators, event.metrics);
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
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
