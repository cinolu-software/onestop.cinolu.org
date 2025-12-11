import type { IBase } from './base.model';
import type { IIndicator } from './indicator.model';
import type { IProject } from './project.model';
import type { IEvent } from './event.model';

export interface IMetric extends IBase {
  indicator: IIndicator;
  target: number;
  achieved: number;
  is_public: boolean;
  project: IProject;
  event: IEvent;
}
