import { CommonModule } from '@angular/common';
import { Component, input, inject, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Plus,
  Trash2,
  FileText,
  Link,
  Upload,
  ExternalLink,
  File,
  SquarePen
} from 'lucide-angular';
import { UiButton, UiInput, UiSelect, SelectOption } from '@shared/ui';
import { IProject, IPhase, IResource, ResourceType } from '@shared/models';
import { ProjectResourcesStore } from '../../store/project-resources.store';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-phase-resources',
  templateUrl: './phase-resources.html',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, UiButton, UiInput, UiSelect]
})
export class PhaseResourcesComponent {
  project = input.required<IProject>();
  phase = input.required<IPhase>();
  resourcesStore = inject(ProjectResourcesStore);
  #fb = inject(FormBuilder);
  icons = {
    plus: Plus,
    edit: SquarePen,
    trash: Trash2,
    file: FileText,
    link: Link,
    upload: Upload,
    external: ExternalLink,
    fileIcon: File
  };
  showResourceForm = signal(false);
  showFileUpload = signal(false);
  editingResourceId = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  resourceForm = this.#fb.group({
    title: ['', Validators.required],
    type: ['LINK' as ResourceType, Validators.required],
    url: ['', Validators.required]
  });
  fileUploadForm = this.#fb.group({
    title: ['', Validators.required],
    file: [null as File | null, Validators.required]
  });
  resourceTypes: SelectOption[] = [
    { label: 'PDF', value: 'PDF' },
    { label: 'Lien', value: 'LINK' },
    { label: 'Image', value: 'IMAGE' },
    { label: 'Vidéo', value: 'VIDEO' },
    { label: 'Autre', value: 'OTHER' }
  ];

  constructor() {
    effect(() => {
      const phase = this.phase();
      if (phase?.id) this.resourcesStore.loadResourcesByPhase(phase.id);
    });
  }

  toggleResourceForm(): void {
    this.showResourceForm.update((val) => !val);
    this.showFileUpload.set(false);
    if (!this.showResourceForm()) {
      this.resetForms();
    }
  }

  toggleFileUpload(): void {
    this.showFileUpload.update((val) => !val);
    this.showResourceForm.set(false);
    if (!this.showFileUpload()) {
      this.resetForms();
    }
  }

  resetForms(): void {
    this.resourceForm.reset({ title: '', type: 'LINK', url: '' });
    this.fileUploadForm.reset({ title: '', file: null });
    this.selectedFile.set(null);
    this.editingResourceId.set(null);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile.set(file);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  onUploadFile(): void {
    const file = this.selectedFile();
    if (this.fileUploadForm.invalid || !file) return;
    const title = this.fileUploadForm.value.title!;
    this.resourcesStore.uploadResource({
      file,
      title,
      phase: this.phase().id,
      project: this.project().id
    });
    this.showFileUpload.set(false);
    this.resetForms();
  }

  onSubmitResource(): void {
    if (this.resourceForm.invalid) return;
    const formValue = this.resourceForm.value;
    const resourceData = {
      title: formValue.title || undefined,
      type: formValue.type as ResourceType,
      url: formValue.url!,
      phase: this.phase().id,
      project: this.project().id
    };
    const editingId = this.editingResourceId();
    if (editingId) {
      this.resourcesStore.updateResource({ id: editingId, data: resourceData });
    } else {
      this.resourcesStore.createResource(resourceData);
    }
    this.toggleResourceForm();
  }

  onEditResource(resource: IResource): void {
    this.editingResourceId.set(resource.id);
    this.showResourceForm.set(true);
    this.showFileUpload.set(false);
    this.resourceForm.patchValue({
      title: resource.title,
      type: resource.type,
      url: resource.url
    });
  }

  onDeleteResource(resourceId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource?')) {
      this.resourcesStore.deleteResource(resourceId);
    }
  }

  getResourceUrl(resource: IResource): string {
    if (resource.url.startsWith('http')) return resource.url;
    return `${environment.apiUrl}uploads/projects/resources/${resource.url}`;
  }

  getResourceIcon(type: ResourceType) {
    switch (type) {
      case 'PDF':
        return this.icons.file;
      case 'LINK':
        return this.icons.link;
      case 'IMAGE':
        return this.icons.file;
      default:
        return this.icons.file;
    }
  }

  getResourceTypeLabel(type: ResourceType): string {
    switch (type) {
      case 'PDF':
        return 'PDF';
      case 'LINK':
        return 'Lien';
      case 'IMAGE':
        return 'Image';
      case 'VIDEO':
        return 'Vidéo';
      case 'OTHER':
        return 'Autre';
      default:
        return type;
    }
  }
}
