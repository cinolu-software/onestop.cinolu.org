import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { Images, LucideAngularModule, SquarePen, Trash } from 'lucide-angular';
import { ActivatedRoute } from '@angular/router';
import { UpdateVenturetore } from '../../store/update-venture.store';
import { FileUpload, Tabs } from '@shared/components';
import { ApiImgPipe } from '@shared/pipes';
import { environment } from '@environments/environment';
import { SECTORS } from '@features/user/ventures/data/sectors.data';
import { STAGES } from '@features/user/ventures/data/stage.data';
import { DeleteGalleryStore } from '@features/user/ventures/store/galleries/delete-gallery.store';
import { GalleryStore } from '@features/user/ventures/store/galleries/galeries.store';
import { VentureStore } from '../../store/venture.store';

@Component({
  selector: 'app-edit-venture',
  providers: [VentureStore, UpdateVenturetore, GalleryStore, DeleteGalleryStore],
  imports: [
    CommonModule,
    StepperModule,
    ButtonModule,
    InputText,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    FileUpload,
    ReactiveFormsModule,
    ApiImgPipe,
    NgOptimizedImage,
    LucideAngularModule,
    Tabs
  ],
  templateUrl: './edit-venture.html'
})
export class EditVentureComponent implements OnInit {
  #fb = inject(FormBuilder);
  store = inject(VentureStore);

  updateVentureStore = inject(UpdateVenturetore);
  form: FormGroup;
  sectors = SECTORS;
  stages = STAGES;
  logoUrl = `${environment.apiUrl}ventures/add-logo/`;
  coverUrl = `${environment.apiUrl}ventures/add-cover/`;
  galleryUrl = `${environment.apiUrl}ventures/gallery/`;
  galleryStore = inject(GalleryStore);
  deleteGalleryStore = inject(DeleteGalleryStore);
  #route = inject(ActivatedRoute);
  icons = { trash: Trash };
  #slug = this.#route.snapshot.params['slug'];

  tabs = [
    { label: 'Modifier la startup', name: 'edit', icon: SquarePen },
    { label: 'Gérer la galerie', name: 'gallery', icon: Images }
  ];
  activeTab = signal('edit');

  constructor() {
    effect(() => {
      const venture = this.store.venture();
      if (!venture) return;
      this.form.patchValue({
        ...venture,
        founded_at: new Date(venture.founded_at)
      });
    });
    this.form = this.#fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      problem_solved: ['', Validators.required],
      target_market: ['', Validators.required],
      email: ['', Validators.email],
      phone_number: [''],
      website: [''],
      linkedin_url: [''],
      sector: [''],
      founded_at: [''],
      location: [''],
      stage: ['']
    });
  }

  ngOnInit(): void {
    this.store.loadVenture(this.#slug);
    this.galleryStore.loadGallery(this.#slug);
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }

  onUpdateVenture(): void {
    if (!this.form.valid) return;
    const venture = this.store.venture();
    this.updateVentureStore.updateVenture({
      slug: venture?.slug || '',
      payload: this.form.value
    });
  }

  onDeleteImage(id: string): void {
    this.deleteGalleryStore.deleteImage(id);
  }

  onFileUploadLoaded(): void {
    this.galleryStore.loadGallery(this.#slug);
  }
}
