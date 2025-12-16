import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IArticle, IImage } from '@shared/models';
import { LucideAngularModule, Trash2, Image } from 'lucide-angular';
import { FileUpload } from '@shared/ui';
import { ApiImgPipe } from '@shared/pipes';
import { environment } from '@env/environment';

@Component({
  selector: 'app-article-gallery',
  templateUrl: './article-gallery.html',
  imports: [CommonModule, NgOptimizedImage, LucideAngularModule, FileUpload, ApiImgPipe]
})
export class ArticleGalleryComponent {
  article = input.required<IArticle>();
  gallery = input.required<IImage[]>();
  isLoading = input<boolean>(false);
  coverUploaded = output<void>();
  galleryUploaded = output<void>();
  deleteImage = output<string>();
  url = `${environment.apiUrl}articles/cover/`;
  galleryUrl = `${environment.apiUrl}articles/gallery/`;
  icons = { Trash2, Image };

  onCoverUploaded(): void {
    this.coverUploaded.emit();
  }

  onGalleryUploaded(): void {
    this.galleryUploaded.emit();
  }

  onDeleteImage(imageId: string): void {
    this.deleteImage.emit(imageId);
  }
}
