import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUpload } from '@shared/components/file-upload/file-upload';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { TextareaModule } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { UnpaginatedArticlesStore } from '../../store/articles/unpaginated-articles.store';
import { UpdateArticleStore } from '../../store/articles/update-article.store';
import { ActivatedRoute } from '@angular/router';
import { UnpaginatedTagStore } from '../../store/tags/unpaginated-tag.store';
import { environment } from '@environments/environment';
import { ArticleStore } from '../../store/articles/article.store';
import { QuillModule } from 'ngx-quill';
import { GalleryStore } from '../../store/galleries/galeries.store';
import { DeleteGalleryStore } from '../../store/galleries/delete-gallery.store';
import { Images, LucideAngularModule, SquarePen, Trash2 } from 'lucide-angular';
import { Tabs } from '@shared/components/tabs/tabs';

@Component({
  selector: 'app-edit-article',
  providers: [
    ArticleStore,
    GalleryStore,
    DeleteGalleryStore,
    UnpaginatedArticlesStore,
    UpdateArticleStore,
    UnpaginatedTagStore
  ],
  imports: [
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    CommonModule,
    Button,
    InputText,
    DatePickerModule,
    ReactiveFormsModule,
    FileUpload,
    NgOptimizedImage,
    LucideAngularModule,
    ApiImgPipe,
    QuillModule,
    Tabs
  ],
  templateUrl: './edit-article.html'
})
export class EditArticle implements OnInit {
  #fb = inject(FormBuilder);
  #route = inject(ActivatedRoute);
  form: FormGroup;
  store = inject(UpdateArticleStore);
  tagsStore = inject(UnpaginatedTagStore);
  articleStore = inject(ArticleStore);
  url = `${environment.apiUrl}articles/cover/`;
  #slug = this.#route.snapshot.params['slug'];
  icons = { trash: Trash2 };
  galleryStore = inject(GalleryStore);
  deleteGalleryStore = inject(DeleteGalleryStore);
  galleryUrl = `${environment.apiUrl}articles/gallery/`;
  tabs = [
    { label: "Modifier l'article", name: 'edit', icon: SquarePen },
    { label: 'Gérer la galerie', name: 'gallery', icon: Images }
  ];
  activeTab = signal('edit');

  constructor() {
    this.form = this.#fb.group({
      id: ['', Validators.required],
      title: ['', Validators.required],
      published_at: ['', Validators.required],
      content: ['', Validators.required],
      summary: ['', Validators.required],
      tags: [[], Validators.required]
    });
    effect(() => {
      const article = this.articleStore.article();
      if (!article) return;
      this.form.patchValue({
        ...article,
        published_at: new Date(article.published_at),
        tags: article.tags?.map((c) => c.id)
      });
    });
  }

  ngOnInit(): void {
    this.articleStore.loadArticle(this.#slug);
    this.galleryStore.loadGallery(this.#slug);
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }

  onUpdateArticle(): void {
    if (!this.form.valid) return;
    this.store.updateArticle(this.form.value);
  }

  onGalleryUploaded(): void {
    this.galleryStore.loadGallery(this.#slug);
  }

  onCoverUploaded(): void {
    this.articleStore.loadArticle(this.#slug);
  }

  onDeleteImage(imgId: string): void {
    this.deleteGalleryStore.deleteImage(imgId);
  }
}
