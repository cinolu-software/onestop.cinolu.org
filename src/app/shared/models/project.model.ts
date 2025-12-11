import { IBase } from './base.model';
import { IUser } from './user.model';
import { ISubprogram } from './subprogram.model';
import { ICategory } from './category.model';
import { IImage } from './image.model';
import { IMetric } from './metric.model';

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
