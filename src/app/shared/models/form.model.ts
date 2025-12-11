import type { IBase } from './base.model';
import type { IPhase } from './phase.model';

export type PhaseFormFieldType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'EMAIL'
  | 'PHONE'
  | 'NUMBER'
  | 'DATE'
  | 'DROPDOWN'
  | 'MULTI_SELECT'
  | 'CHECKBOX'
  | 'RADIO'
  | 'FILE_UPLOAD'
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'select'
  | 'dropdown'
  | 'multiselect'
  | 'multi_select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'file_upload';

export interface IFormFieldOption {
  label: string;
  value: string;
}

export interface IFormField {
  label: string;
  type: PhaseFormFieldType;
  required: boolean;
  placeholder?: string;
  options?: IFormFieldOption[];
}

export interface IForm extends IBase {
  title: string;
  description?: string;
  is_active: boolean;
  phase: IPhase | string;
  fields: IFormField[];
}

export interface ISubmissionResponse {
  label: string;
  value: string | number | boolean | string[] | number[] | null;
}

export interface ISubmission extends IBase {
  form: IForm | { id: string; phase?: IPhase } | string;
  responses: ISubmissionResponse[];
  submitted_by_name?: string;
  submitted_by_email?: string;
  submitted_by_phone?: string;
  note?: string;
}
