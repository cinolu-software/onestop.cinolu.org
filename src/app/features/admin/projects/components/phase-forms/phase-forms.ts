import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { IForm, IFormField, IFormFieldOption, IPhase, IProject } from '@shared/models';
import { PhaseFormFieldType } from '@shared/models/entities.models';
import { ProjectFormsStore } from '../../store/project-forms.store';

type FieldFormGroup = FormGroup<{
  id: FormControl<string>;
  label: FormControl<string>;
  type: FormControl<PhaseFormFieldType>;
  required: FormControl<boolean>;
  placeholder: FormControl<string | null>;
  helperText: FormControl<string | null>;
  description: FormControl<string | null>;
  options: FormArray<FormGroup<{ label: FormControl<string>; value: FormControl<string> }>>;
}>;

@Component({
  selector: 'app-phase-forms',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    SelectModule,
    DividerModule
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
  previewingForm = signal<IForm | null>(null);
  previewSubmitted = signal(false);
  previewFormGroup = this.#fb.group<Record<string, FormControl<unknown>>>({});

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
    settings: this.#fb.group({
      allowMultipleSubmissions: [false],
      confirmationMessage: [''],
      submissionNote: ['']
    }),
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
    const payload = this.buildRequestPayload();
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

  onPreviewForm(form: IForm): void {
    this.previewingForm.set(form);
    this.previewSubmitted.set(false);
    const controls: Record<string, FormControl<unknown>> = {};
    form.fields.forEach((field) => {
      controls[field.id] = this.createPreviewControl(field);
    });
    this.previewFormGroup = this.#fb.group(controls);
  }

  onSubmitPreview(): void {
    if (!this.previewingForm()) return;
    if (this.previewFormGroup.invalid) {
      this.previewFormGroup.markAllAsTouched();
      return;
    }
    this.previewSubmitted.set(true);
  }

  onToggleCheckboxValue(fieldId: string, optionValue: string, checked: boolean): void {
    const control = this.previewFormGroup.get(fieldId);
    if (!control) return;
    const currentValue = (control.value as string[]) || [];
    if (checked) {
      control.setValue([...currentValue, optionValue]);
    } else {
      control.setValue(currentValue.filter((val) => val !== optionValue));
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
      id: this.#fb.control(field?.id ?? this.generateFieldId()),
      label: this.#fb.control(field?.label ?? '', { validators: Validators.required, nonNullable: true }),
      type: this.#fb.control<PhaseFormFieldType>(field?.type ?? 'SHORT_TEXT', {
        validators: Validators.required,
        nonNullable: true
      }),
      required: this.#fb.control<boolean>(field?.required ?? false, { nonNullable: true }),
      placeholder: this.#fb.control(field?.placeholder ?? ''),
      helperText: this.#fb.control(field?.helperText ?? ''),
      description: this.#fb.control(field?.description ?? ''),
      options: this.#fb.array((field?.options || []).map((option) => this.createOptionGroup(option))) as FormArray<
        FormGroup<{ label: FormControl<string>; value: FormControl<string> }>
      >
    }) as FieldFormGroup;
  }

  private createOptionGroup(option?: IFormFieldOption) {
    return this.#fb.group({
      label: this.#fb.control(option?.label ?? '', { nonNullable: true, validators: Validators.required }),
      value: this.#fb.control(option?.value ?? '', { nonNullable: true, validators: Validators.required })
    });
  }

  private createPreviewControl(field: IFormField): FormControl<unknown> {
    const validators = field.required ? [Validators.required] : [];
    if (this.isMultiValueField(field.type)) {
      return this.#fb.control<string[]>([], validators);
    }
    if (field.type === 'FILE_UPLOAD' || field.type === 'file' || field.type === 'file_upload') {
      return this.#fb.control<File | null>(null, validators);
    }
    return this.#fb.control('', validators);
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
      welcome_message: '',
      is_active: true,
      settings: {
        allowMultipleSubmissions: false,
        confirmationMessage: '',
        submissionNote: ''
      }
    });
    this.fieldsArray.clear();
    this.addField();
    this.editingFormId.set(null);
    if (shouldHide) {
      this.showFormEditor.set(false);
    }
  }

  private buildRequestPayload(): {
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
        id: control.controls.id.value,
        label: control.controls.label.value,
        type: control.controls.type.value,
        required: control.controls.required.value,
        placeholder: control.controls.placeholder.value || undefined,
        helperText: control.controls.helperText.value || undefined,
        description: control.controls.description.value || undefined,
        options: optionsArray.length ? optionsArray : undefined
      } as IFormField;
    });
    return {
      title: raw.title!,
      description: raw.description || undefined,
      welcome_message: raw.welcome_message || undefined,
      is_active: raw.is_active ?? true,
      phase: phaseId,
      fields
    };
  }

  private generateFieldId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `field-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
