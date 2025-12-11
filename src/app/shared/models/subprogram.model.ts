import { IProgram } from './program.model';
import { IProject } from './project.model';
import { IEvent } from './event.model';
import { IBase } from './base.model';

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
