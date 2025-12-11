import type { IBase } from './base.model';
import type { ICategory } from './category.model';
import type { IIndicator } from './indicator.model';
import type { IProject } from './project.model';
import type { IEvent } from './event.model';

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
