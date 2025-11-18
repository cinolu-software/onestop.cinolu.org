import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SquarePen, Images, ChartColumn } from 'lucide-angular';
import { Tabs, MetricsTableComponent } from '@shared/components';
import { totalMetrics, achievementPercentage, metricsMap, metricsMapToDto } from '@shared/helpers';
import { IProject } from '@shared/models';
import { IndicatorsStore } from '@features/admin/programs/store/indicators.store';
import { GalleryStore } from '../../store/project-gallery.store';
import { ProjectsStore } from '../../store/projects.store';
import { ProjectMetricsStore } from '../../store/project-metrics.store';
import { ProjectDetailsComponent } from '../../components/project-details/project-details';
import { ProjectGalleryComponent } from '../../components/project-gallery/project-gallery';
import { ProjectEditFormComponent } from '../../components/project-edit-form/project-edit-form';
import { ProjectDetailsSkeletonComponent } from '../../components/project-details-skeleton/project-details-skeleton';

@Component({
  selector: 'app-project-edit',
  templateUrl: './edit-project.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [IndicatorsStore, GalleryStore, ProjectsStore, ProjectMetricsStore],
  imports: [
    CommonModule,
    Tabs,
    MetricsTableComponent,
    ProjectDetailsComponent,
    ProjectGalleryComponent,
    ProjectEditFormComponent,
    ProjectDetailsSkeletonComponent
  ]
})
export class EditProjectComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #slug = this.#route.snapshot.params['slug'];
  projectStore = inject(ProjectsStore);
  galleryStore = inject(GalleryStore);
  metricsStore = inject(ProjectMetricsStore);
  indicatorsStore = inject(IndicatorsStore);
  metricsMap = {};
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
    this.#watchProjectChanges();
  }

  ngOnInit(): void {
    this.projectStore.loadProject(this.#slug);
    this.galleryStore.loadGallery(this.#slug);
  }

  #watchProjectChanges(): void {
    effect(() => {
      const project = this.projectStore.project();
      if (!project) return;
      this.#initMetrics(project);
    });
  }

  #initMetrics(project: IProject): void {
    const indicators = this.indicatorsStore.indicators();
    this.metricsMap = metricsMap(indicators, project.metrics);
  }

  onSaveMetrics(): void {
    const project = this.projectStore.project();
    if (!project) return;
    const indicators = this.indicatorsStore.indicators();
    const metrics = metricsMapToDto(this.metricsMap, indicators);
    this.metricsStore.addMetrics({ id: project.id, metrics });
  }

  onCoverUploaded(): void {
    this.projectStore.loadProject(this.#slug);
  }

  onGalleryUploaded(): void {
    this.galleryStore.loadGallery(this.#slug);
  }

  onDeleteImage(id: string): void {
    this.galleryStore.deleteImage(id);
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }
}
