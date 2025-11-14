import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Images, SquarePen } from 'lucide-angular';
import { Tabs } from '@shared/components/tabs/tabs';
import { ArticleStore } from '../../store/articles/article.store';
import { GalleryStore } from '../../store/galleries/galeries.store';
import { DeleteGalleryStore } from '../../store/galleries/delete-gallery.store';
import { ArticleEditFormComponent } from '../../components/article-edit-form/article-edit-form';
import { ArticleGalleryComponent } from '../../components/article-gallery/article-gallery';

@Component({
  selector: 'app-edit-article',
  providers: [ArticleStore, GalleryStore, DeleteGalleryStore],
  imports: [CommonModule, Tabs, ArticleEditFormComponent, ArticleGalleryComponent],
  templateUrl: './edit-article.html'
})
export class EditArticle implements OnInit {
  #route = inject(ActivatedRoute);
  #slug = this.#route.snapshot.params['slug'];
  articleStore = inject(ArticleStore);
  galleryStore = inject(GalleryStore);
  deleteGalleryStore = inject(DeleteGalleryStore);
  activeTab = signal('edit');
  tabs = [
    { label: "Mettre à jour l'article", name: 'edit', icon: SquarePen },
    { label: 'Gérer la galerie', name: 'gallery', icon: Images }
  ];

  ngOnInit(): void {
    this.articleStore.loadArticle(this.#slug);
    this.galleryStore.loadGallery(this.#slug);
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
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
