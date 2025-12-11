import type { IBase } from './base.model';

export interface IIndicator extends IBase {
  name: string;
  category: string;
  target: number | null;
  year: number | null;
}
