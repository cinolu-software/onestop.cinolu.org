import { CommonModule } from '@angular/common';
import { Component, input, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Plus, Edit, Trash2, FileText, Link, Upload, ExternalLink, File } from 'lucide-angular';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { IProject, IPhase, IResource, ResourceType } from '@shared/models';
import { ProjectResourcesStore } from '../../store/project-resources.store';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-project-resources',
  templateUrl: './project-resources.html',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, Button, InputText, SelectModule, DialogModule]
})
export class ProjectResourcesComponent {
  project = input.required<IProject>();
  phase = input.required<IPhase>();
  resourcesStore = inject(ProjectResourcesStore);
  #fb = inject(FormBuilder);

  icons = {
    plus: Plus,
    edit: Edit,
    trash: Trash2,
    file: FileText,
    link: Link,
    upload: Upload,
    external: ExternalLink,
    fileIcon: File
  };

  showResourceForm = false;
  showFileUpload = false;
  editingResourceId: string | null = null;
  selectedFile: File | null = null;

  resourceForm = this.#fb.group({
    title: ['', Validators.required],
    type: ['LINK' as ResourceType, Validators.required],
    url: ['', Validators.required]
  });

  fileUploadForm = this.#fb.group({
    title: ['', Validators.required],
    file: [null as File | null, Validators.required]
  });

  resourceTypes: ResourceType[] = ['PDF', 'LINK', 'IMAGE', 'OTHER'];

  constructor() {
    effect(() => {
      const phase = this.phase();
      if (phase?.id) this.resourcesStore.loadResourcesByPhase(phase.id);
    });
  }

  toggleResourceForm(): void {
    this.showResourceForm = !this.showResourceForm;
    this.showFileUpload = false;
    if (!this.showResourceForm) {
      this.resetForms();
    }
  }

  toggleFileUpload(): void {
    this.showFileUpload = !this.showFileUpload;
    this.showResourceForm = false;
    if (!this.showFileUpload) {
      this.resetForms();
    }
  }

  resetForms(): void {
    this.resourceForm.reset({ title: '', type: 'LINK', url: '' });
    this.fileUploadForm.reset({ title: '', file: null });
    this.selectedFile = null;
    this.editingResourceId = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileUploadForm.patchValue({ file: this.selectedFile });
      if (!this.fileUploadForm.value.title) {
        this.fileUploadForm.patchValue({ title: this.selectedFile.name.split('.')[0] });
      }
    }
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
    if (this.editingResourceId) {
      this.resourcesStore.updateResource({ id: this.editingResourceId, data: resourceData });
    } else {
      this.resourcesStore.createResource(resourceData);
    }
    this.toggleResourceForm();
  }

  onSubmitFileUpload(): void {
    if (this.fileUploadForm.invalid || !this.selectedFile) return;
    const title = this.fileUploadForm.value.title!;
    this.resourcesStore.uploadResource({
      file: this.selectedFile,
      title,
      phase: this.phase().id,
      project: this.project().id
    });
    this.toggleFileUpload();
  }

  onEditResource(resource: IResource): void {
    this.editingResourceId = resource.id;
    this.showResourceForm = true;
    this.showFileUpload = false;
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
      case 'OTHER':
        return 'Autre';
      default:
        return type;
    }
  }
}
