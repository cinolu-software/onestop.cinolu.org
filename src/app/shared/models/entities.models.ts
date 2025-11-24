interface IBase {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface ITag extends IBase {
  name: string;
}

export interface IIndicator extends IBase {
  name: string;
  category: string;
  target: number | null;
  year: number | null;
}

export interface IComment extends IBase {
  content: string;
  author: IUser;
  article: IArticle;
}

export interface IImage extends IBase {
  image: string;
}

export interface IArticle extends IBase {
  title: string;
  slug: string;
  image: string;
  summary: string;
  content: string;
  published_at: Date;
  is_highlighted: boolean;
  tags: ITag[];
  comments: IComment[];
  author: IUser;
  gallery?: IImage[];
}

export interface IUser extends IBase {
  email: string;
  name: string;
  password: string;
  biography: string;
  phone_number: string;
  city: string;
  country: string;
  gender: string;
  birth_date: Date;
  google_image: string;
  profile: string;
  referral_code: string;
  referred_by: IUser;
  referralsCount?: number;
  referrals: IUser[];
  ventures: IVenture[];
  roles: IRole[];
  participated_projects: IProject[];
  participated_events: IEvent[];
  managed_projects: IProject[];
  managed_events: IEvent[];
  articles: IArticle[];
  comments: IComment[];
}

export interface IProject extends IBase {
  name: string;
  is_highlighted: boolean;
  slug: string;
  cover: string;
  description: string;
  started_at: Date;
  ended_at: Date;
  is_published: boolean;
  context: string;
  objectives: string;
  duration_hours: number;
  selection_criteria: string;
  project_manager: IUser | null;
  program: ISubprogram;
  categories: ICategory[];
  gallery: IImage[];
  metrics: IMetric[];
  participants: IUser[];
}

export interface IEvent extends IBase {
  name: string;
  slug: string;
  is_highlighted: boolean;
  cover: string;
  place: string;
  description: string;
  context: string;
  objectives: string;
  duration_hours: number;
  event_manager?: IUser;
  selection_criteria: string;
  started_at: Date;
  is_published: boolean;
  ended_at: Date;
  program: ISubprogram;
  categories: ICategory[];
  gallery: IImage[];
  metrics: IMetric[];
  participants: IUser[];
}

export interface IVenture extends IBase {
  name: string;
  slug: string;
  description: string;
  problem_solved: string;
  target_market: string;
  logo: string;
  cover: string;
  email: string;
  phone_number: string;
  website: string;
  linkedin_url: string;
  sector: string;
  is_published: boolean;
  founded_at: Date;
  location: string;
  stage: string;
  owner: IUser;
  gallery: IImage[];
  products: IProduct[];
}

export interface IProgram extends IBase {
  name: string;
  description: string;
  slug: string;
  logo: string;
  is_published: boolean;
  is_highlighted: boolean;
  subprograms: ISubprogram[];
  category: ICategory;
  indicators: IIndicator[];
  indicators_grouped?: Record<string, IIndicator[]>;
}

export interface ISubprogram extends IBase {
  name: string;
  description: string;
  slug: string;
  logo: string;
  is_published: boolean;
  is_highlighted: boolean;
  program: IProgram;
  projects: IProject[];
  events: IEvent[];
}

export interface IMetric extends IBase {
  indicator: IIndicator;
  target: number;
  achieved: number;
  is_public: boolean;
  project: IProject;
  event: IEvent;
}

export interface IProduct extends IBase {
  name: string;
  slug: string;
  description: string;
  price: number;
  venture: IVenture;
  gallery: IImage[];
}

export interface ICategory extends IBase {
  name: string;
}

export interface IRole extends IBase {
  name: string;
  label: string;
}

export interface ITag extends IBase {
  name: string;
}

export interface IHighlight {
  programs?: IProgram[];
  subprograms?: ISubprogram[];
  events?: IEvent[];
  projects?: IProject[];
  articles?: IArticle[];
}

export type HighlightItem =
  | (IProgram & { sourceKey: 'programs' })
  | (ISubprogram & { sourceKey: 'subprograms' })
  | (IEvent & { sourceKey: 'events' })
  | (IProject & { sourceKey: 'projects' })
  | (IArticle & { sourceKey: 'articles' });

export interface IPhase extends IBase {
  name: string;
  description: string;
  order: number;
  started_at: Date;
  ended_at: Date;
  is_active: boolean;
  project: IProject;
  resources?: IResource[];
}

export type ResourceType = 'PDF' | 'LINK' | 'IMAGE' | 'OTHER';

export interface IResource extends IBase {
  title: string;
  url: string;
  type: ResourceType;
  phase: IPhase;
  project: IProject;
}

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
  id: string;
  label: string;
  type: PhaseFormFieldType;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  description?: string;
  options?: IFormFieldOption[];
  validation?: Record<string, unknown>;
}

export interface IForm extends IBase {
  title: string;
  description?: string;
  is_active: boolean;
  phase: IPhase | string;
  fields: IFormField[];
}
