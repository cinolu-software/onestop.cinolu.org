import { CommonModule } from '@angular/common';
import { Component, input, inject, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2, FileText, CalendarDays, ListOrdered, SquarePen } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IProject, IPhase } from '@shared/models';
import { ProjectPhasesStore } from '../../store/project-phases.store';
import { ProjectResourcesStore } from '../../store/project-resources.store';
import { ProjectResourcesComponent } from '../project-resources/project-resources';
import { PhaseCardComponent } from '../../ui/phase-card/phase-card';

@Component({
  selector: 'app-project-phases',
  templateUrl: './project-phases.html',
  providers: [ProjectPhasesStore, ProjectResourcesStore],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ProjectResourcesComponent,
    PhaseCardComponent,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    InputNumberModule,
    CheckboxModule,
    DialogModule,
    DividerModule
  ]
})
export class ProjectPhasesComponent {
  project = input.required<IProject>();
  phasesStore = inject(ProjectPhasesStore);
  resourcesStore = inject(ProjectResourcesStore);
  #fb = inject(FormBuilder);
  icons = {
    plus: Plus,
    edit: SquarePen,
    trash: Trash2,
    file: FileText,
    calendar: CalendarDays,
    list: ListOrdered
  };
  showPhaseForm = signal<boolean>(false);
  editingPhaseId: string | null = null;
  phaseForm = this.#fb.group({
    name: ['', Validators.required],
    description: [''],
    order: [0],
    started_at: [''],
    ended_at: [''],
    is_active: [false]
  });

  constructor() {
    effect(() => {
      const project = this.project();
      if (project?.id) this.phasesStore.loadPhasesByProject(project.id);
    });
  }

  togglePhaseForm(): void {
    this.showPhaseForm.update((value) => !value);
    if (!this.showPhaseForm()) this.resetPhaseForm();
  }

  resetPhaseForm(): void {
    this.phaseForm.reset({
      name: '',
      description: '',
      order: this.phasesStore.phases().length,
      started_at: '',
      ended_at: '',
      is_active: false
    });
    this.editingPhaseId = null;
  }

  onSubmitPhase(): void {
    if (this.phaseForm.invalid) return;
    const formValue = this.phaseForm.value;
    const phaseData = {
      name: formValue.name!,
      description: formValue.description || undefined,
      order: formValue.order || 0,
      started_at: formValue.started_at ? new Date(formValue.started_at) : undefined,
      ended_at: formValue.ended_at ? new Date(formValue.ended_at) : undefined,
      is_active: formValue.is_active || false,
      project: this.project().id
    };
    if (this.editingPhaseId) {
      this.phasesStore.updatePhase({ id: this.editingPhaseId, data: phaseData });
    } else {
      this.phasesStore.createPhase(phaseData);
    }
    this.togglePhaseForm();
  }

  onEditPhase(phase: IPhase): void {
    this.editingPhaseId = phase.id;
    this.showPhaseForm.set(true);
    this.phaseForm.patchValue({
      name: phase.name,
      description: phase.description,
      order: phase.order,
      started_at: phase.started_at ? (new Date(phase.started_at) as unknown as string) : '',
      ended_at: phase.ended_at ? (new Date(phase.ended_at) as unknown as string) : '',
      is_active: phase.is_active
    });
  }

  onDeletePhase(phaseId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette phase?')) {
      this.phasesStore.deletePhase(phaseId);
    }
  }

  selectPhase(phase: IPhase): void {
    // Unselect if the same phase is clicked again
    if (this.phasesStore.selectedPhase()?.id === phase.id) {
      this.phasesStore.selectPhase(null);
      return;
    }

    this.phasesStore.selectPhase(phase);
    this.resourcesStore.loadResourcesByPhase(phase.id);
  }
}
