import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { StepperModule } from 'primeng/stepper';
import { unpaginatedVenturesStore } from '@features/user/ventures/store/ventures/venture-unpaginated.store';
import { ActivatedRoute } from '@angular/router';
import { ProductsStore } from '../../store/products/products.store';
import { environment } from '@environments/environment';
import { FileUpload } from '@shared/components/file-upload/file-upload';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { Images, LucideAngularModule, SquarePen, Trash } from 'lucide-angular';
import { NgOptimizedImage } from '@angular/common';
import { Tabs } from '@shared/components/tabs/tabs';

@Component({
  selector: 'app-product-add',
  providers: [ProductsStore, unpaginatedVenturesStore],
  imports: [
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    DatePickerModule,
    Textarea,
    InputTextModule,
    StepperModule,
    SelectModule,
    FileUpload,
    ApiImgPipe,
    LucideAngularModule,
    NgOptimizedImage,
    Tabs
  ],
  templateUrl: './edit-product.html'
})
export class EditProductComponent implements OnInit {
  #fb = inject(FormBuilder);
  form: FormGroup;
  venturesStore = inject(unpaginatedVenturesStore);
  store = inject(ProductsStore);
  #route = inject(ActivatedRoute);
  #slug = this.#route.snapshot.params['slug'];

  galleryUrl = `${environment.apiUrl}products/gallery/`;
  icons = { trash: Trash };
  tabs = [
    { label: 'Modifier le produit', name: 'edit', icon: SquarePen },
    { label: 'Gérer la galerie', name: 'gallery', icon: Images }
  ];
  activeTab = signal('edit');

  constructor() {
    this.venturesStore.loadVentures();
    this.form = this.#fb.group({
      slug: ['', Validators.required],
      ventureId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
    effect(() => {
      const product = this.store.product();
      if (!product) return;
      this.form.patchValue({
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        ventureId: product.venture.id
      });
    });
  }

  ngOnInit(): void {
    this.store.loadProduct(this.#slug);
    this.store.loadGallery(this.#slug);
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }

  onEditProduct(): void {
    if (!this.form.valid) return;
    this.store.updateProduct(this.form.value);
  }

  onDeleteImage(imageId: string): void {
    this.store.deleteImage(imageId);
  }

  onFileUploadLoaded(): void {
    this.store.loadGallery(this.#slug);
  }
}
