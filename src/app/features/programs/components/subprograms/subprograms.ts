import { Component, Input, inject, signal } from '@angular/core';
import {
  LucideAngularModule,
  SquarePen,
  Trash,
  Plus,
  Eye,
  EyeOff,
  Star,
  StarOff
} from 'lucide-angular';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubprogramsStore } from '../../store/subprograms.store';
import { ISubprogram } from '@shared/models';
import { environment } from '../../../../../environments/environment';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { IProgram } from '@shared/models';
import { FileUpload, UiAvatar, UiButton, UiConfirmDialog, UiInput } from '@shared/ui';
import { ConfirmationService } from '@shared/services/confirmation';

@Component({
  selector: 'app-list-subprograms',
  templateUrl: './subprograms.html',
  providers: [SubprogramsStore],
  imports: [
    LucideAngularModule,
    CommonModule,
    UiButton,
    UiInput,
    ReactiveFormsModule,
    UiConfirmDialog,
    FileUpload,
    ApiImgPipe,
    UiAvatar
  ]
})
export class ListSubprograms {
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  store = inject(SubprogramsStore);

  @Input({ required: true })
  set program(value: IProgram | null) {
    this.programSignal.set(value);
    const programId = value?.id || '';
    this.subprogramForm.patchValue({ programId });
    if (programId) {
      this.loadSubprograms(programId);
    }
  }

  programSignal = signal<IProgram | null>(null);
  subprogramForm: FormGroup = this.#fb.group({
    id: [''],
    programId: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required]
  });
  skeletonArray = Array.from({ length: 4 }, (_, i) => i + 1);
  url = environment.apiUrl + 'subprograms/logo/';
  icons = {
    edit: SquarePen,
    trash: Trash,
    plus: Plus,
    eye: Eye,
    eyeOff: EyeOff,
    star: Star,
    starOff: StarOff
  };
  formVisible = signal(false);
  formMode = signal<'create' | 'edit'>('create');
  editingSubprogram = signal<ISubprogram | null>(null);

  highlightSubprogram(id: string): void {
    this.store.highlightSubprogram(id);
  }

  loadSubprograms(programId?: string): void {
    const id = programId ?? this.programSignal()?.id;
    if (!id) return;
    this.store.loadUnpaginatedSubprograms(id);
  }

  onPublishProgram(id: string): void {
    this.store.publishSubprogram(id);
  }

  onFileUploadLoaded(): void {
    this.loadSubprograms();
  }

  onToggleForm(subprogram: ISubprogram | null = null): void {
    if (subprogram) {
      this.formMode.set('edit');
      this.editingSubprogram.set(subprogram);
      this.subprogramForm.patchValue({
        id: subprogram.id,
        programId: subprogram.program?.id || this.programSignal()?.id || '',
        name: subprogram.name,
        description: subprogram.description
      });
      this.formVisible.set(true);
      return;
    }
    this.formMode.set('create');
    this.editingSubprogram.set(null);
    this.subprogramForm.reset({
      id: '',
      programId: this.programSignal()?.id || '',
      name: '',
      description: ''
    });
    this.formVisible.update((visible) => !visible);
  }

  onCancelForm(): void {
    this.formVisible.set(false);
    this.formMode.set('create');
    this.editingSubprogram.set(null);
    this.subprogramForm.reset({
      id: '',
      programId: this.programSignal()?.id || '',
      name: '',
      description: ''
    });
  }

  onSubmit(): void {
    if (this.subprogramForm.invalid) return;
    const payload = this.subprogramForm.getRawValue();
    if (!payload.programId) {
      payload.programId = this.programSignal()?.id || '';
    }
    if (this.formMode() === 'edit') {
      this.store.updateSubprogram({
        payload,
        onSuccess: () => {
          this.onCancelForm();
          this.loadSubprograms();
        }
      });
      return;
    }
    this.store.addSubprogram({
      payload,
      onSuccess: () => {
        this.onCancelForm();
        this.loadSubprograms();
      }
    });
  }

  onDeleteRole(roleId: string, event: Event): void {
    this.#confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Etes-vous sûr ?',
      acceptLabel: 'Confirmer',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        severity: 'danger'
      },
      accept: () => {
        this.store.deleteSubprogram(roleId);
        this.loadSubprograms();
      }
    });
  }
}
