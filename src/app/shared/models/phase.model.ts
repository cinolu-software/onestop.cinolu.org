import type { IBase } from './base.model';
import type { IProject } from './project.model';

export type ResourceType = 'PDF' | 'LINK' | 'IMAGE' | 'VIDEO' | 'OTHER';

export interface IResource extends IBase {
  title: string;
  url: string;
  type: ResourceType;
  phase: IPhase;
  project: IProject;
}

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
