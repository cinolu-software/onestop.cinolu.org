import { NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IProject, IImage } from '@shared/models';
import { LucideAngularModule, Trash2, Image } from 'lucide-angular';
import { FileUpload } from '@shared/ui';
import { ApiImgPipe } from '@shared/pipes';
import { environment } from '@env/environment';

@Component({
  selector: 'app-project-gallery',
  templateUrl: './project-gallery.html',
  imports: [NgOptimizedImage, LucideAngularModule, FileUpload, ApiImgPipe]
})
export class ProjectGalleryComponent {
  project = input.required<IProject>();
  gallery = input.required<IImage[]>();
  isLoading = input<boolean>(false);
  coverUploaded = output<void>();
  galleryUploaded = output<void>();
  deleteImage = output<string>();
  url = `${environment.apiUrl}projects/cover/`;
  galleryUrl = `${environment.apiUrl}projects/gallery/`;
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
