import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  LucideAngularModule,
  ClipboardList,
  Eye,
  Plus,
  SquarePen,
  Trash2,
  FileText,
  CircleCheck
} from 'lucide-angular';
import { UiButton, UiCheckbox, UiInput, UiSelect, UiTextarea } from '@shared/ui';
import { IForm, IFormField, IFormFieldOption, IPhase, IProject } from '@shared/models';
import { PhaseFormFieldType } from '@shared/models';
import { ProjectFormsStore } from '../../store/project-forms.store';

type FieldFormGroup = FormGroup<{
  label: FormControl<string>;
  type: FormControl<PhaseFormFieldType>;
  required: FormControl<boolean>;
  placeholder: FormControl<string | null>;
  options: FormArray<FormGroup<{ label: FormControl<string>; value: FormControl<string> }>>;
}>;

@Component({
  selector: 'app-phase-forms',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    UiButton,
    UiInput,
    UiTextarea,
    UiCheckbox,
    UiSelect
  ],
  templateUrl: './phase-forms.html'
})
export class PhaseFormsComponent {
  project = input.required<IProject>();
  phase = input.required<IPhase>();
  formsStore = inject(ProjectFormsStore);
  #fb = inject(FormBuilder);
  icons = {
    form: ClipboardList,
    preview: Eye,
    plus: Plus,
    edit: SquarePen,
    trash: Trash2,
    file: FileText,
    success: CircleCheck
  };
  showFormEditor = signal(false);
  editingFormId = signal<string | null>(null);
  fieldTypeOptions: { label: string; value: PhaseFormFieldType }[] = [
    { label: 'Texte court', value: 'SHORT_TEXT' },
    { label: 'Texte long', value: 'LONG_TEXT' },
    { label: 'E-mail', value: 'EMAIL' },
    { label: 'Téléphone', value: 'PHONE' },
    { label: 'Nombre', value: 'NUMBER' },
    { label: 'Date', value: 'DATE' },
    { label: 'Liste déroulante', value: 'DROPDOWN' },
    { label: 'Multi-sélection', value: 'MULTI_SELECT' },
    { label: 'Cases à cocher', value: 'CHECKBOX' },
    { label: 'Choix unique', value: 'RADIO' },
    { label: 'Téléversement de fichier', value: 'FILE_UPLOAD' }
  ];
  #optionsTypes = new Set<PhaseFormFieldType>([
    'DROPDOWN',
    'select',
    'dropdown',
    'MULTI_SELECT',
    'multiselect',
    'multi_select',
    'CHECKBOX',
    'checkbox',
    'RADIO',
    'radio'
  ]);
  #multiValueTypes = new Set<PhaseFormFieldType>([
    'MULTI_SELECT',
    'multiselect',
    'multi_select',
    'CHECKBOX',
    'checkbox'
  ]);

  formForm = this.#fb.group({
    title: ['', Validators.required],
    description: [''],
    welcome_message: [''],
    is_active: [true],
    fields: this.#fb.array<FieldFormGroup>([])
  });

  constructor() {
    this.addField();
    effect(() => {
      const activePhase = this.phase();
      if (activePhase?.id) {
        this.formsStore.loadFormsByPhase(activePhase.id);
        this.resetFormEditorState();
      }
    });
  }

  get fieldsArray(): FormArray<FieldFormGroup> {
    return this.formForm.get('fields') as FormArray<FieldFormGroup>;
  }

  fieldOptionsArray(fieldIndex: number) {
    return this.fieldsArray.at(fieldIndex).controls.options;
  }

  addField(field?: IFormField): void {
    this.fieldsArray.push(this.createFieldGroup(field));
  }

  removeField(index: number): void {
    this.fieldsArray.removeAt(index);
  }

  addOption(fieldIndex: number, option?: IFormFieldOption): void {
    this.fieldOptionsArray(fieldIndex).push(this.createOptionGroup(option));
  }

  removeOption(fieldIndex: number, optionIndex: number): void {
    this.fieldOptionsArray(fieldIndex).removeAt(optionIndex);
  }

  toggleFormEditor(visible?: boolean): void {
    const nextValue = typeof visible === 'boolean' ? visible : !this.showFormEditor();
    this.showFormEditor.set(nextValue);
    if (!nextValue) {
      this.resetFormEditorState();
    }
  }

  onSubmitForm(): void {
    if (this.formForm.invalid || this.fieldsArray.length === 0) return;
    const payload = this.#buildRequestPayload();
    const editingId = this.editingFormId();
    if (editingId) {
      this.formsStore.updateForm({ id: editingId, data: payload });
    } else {
      this.formsStore.createForm(payload);
    }
    this.toggleFormEditor(false);
  }

  onEditForm(form: IForm): void {
    this.showFormEditor.set(true);
    this.editingFormId.set(form.id);
    this.formForm.patchValue({
      title: form.title,
      description: form.description || '',
      is_active: form.is_active
    });
    this.setFields(form.fields);
  }

  onDeleteForm(formId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce formulaire ?')) {
      this.formsStore.deleteForm(formId);
    }
  }

  shouldDisplayOptions(type: PhaseFormFieldType): boolean {
    return this.#optionsTypes.has(type);
  }

  isMultiValueField(type: PhaseFormFieldType): boolean {
    return this.#multiValueTypes.has(type);
  }

  fieldTypeLabel(type: PhaseFormFieldType): string {
    const option = this.fieldTypeOptions.find((item) => item.value === type);
    return option?.label || 'Champ';
  }

  normalizeType(type: PhaseFormFieldType): string {
    return (type || 'SHORT_TEXT').toString().toUpperCase();
  }

  private createFieldGroup(field?: IFormField): FieldFormGroup {
    return this.#fb.group({
      label: this.#fb.control(field?.label ?? '', {
        validators: Validators.required,
        nonNullable: true
      }),
      type: this.#fb.control<PhaseFormFieldType>(field?.type ?? 'SHORT_TEXT', {
        validators: Validators.required,
        nonNullable: true
      }),
      required: this.#fb.control<boolean>(field?.required ?? false, { nonNullable: true }),
      placeholder: this.#fb.control(field?.placeholder ?? ''),
      options: this.#fb.array(
        (field?.options || []).map((option) => this.createOptionGroup(option))
      ) as FormArray<FormGroup<{ label: FormControl<string>; value: FormControl<string> }>>
    }) as FieldFormGroup;
  }

  private createOptionGroup(option?: IFormFieldOption) {
    return this.#fb.group({
      label: this.#fb.control(option?.label ?? '', {
        nonNullable: true,
        validators: Validators.required
      }),
      value: this.#fb.control(option?.value ?? '', {
        nonNullable: true,
        validators: Validators.required
      })
    });
  }

  private setFields(fields: IFormField[]): void {
    this.fieldsArray.clear();
    fields.forEach((field) => this.addField(field));
    if (this.fieldsArray.length === 0) {
      this.addField();
    }
  }

  resetFormEditorState(shouldHide = true): void {
    this.formForm.reset({
      title: '',
      description: '',
      is_active: true
    });
    this.fieldsArray.clear();
    this.addField();
    this.editingFormId.set(null);
    if (shouldHide) {
      this.showFormEditor.set(false);
    }
  }

  #buildRequestPayload(): {
    title: string;
    description?: string;
    welcome_message?: string;
    is_active: boolean;
    phase: string;
    fields: IFormField[];
  } {
    const raw = this.formForm.value;
    const phaseId = this.phase().id;
    const fields = this.fieldsArray.controls.map((control) => {
      const optionsArray = control.controls.options.value as IFormFieldOption[];
      return {
        label: control.controls.label.value,
        type: control.controls.type.value,
        required: control.controls.required.value,
        placeholder: control.controls.placeholder.value || undefined,
        options: optionsArray.length ? optionsArray : undefined
      } as IFormField;
    });
    return {
      title: raw.title!,
      description: raw.description || undefined,
      is_active: raw.is_active ?? true,
      phase: phaseId,
      fields
    };
  }
}
