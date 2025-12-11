import type { IBase } from './base.model';
import type { IImage } from './image.model';
import type { IUser } from './user.model';

export interface IProduct extends IBase {
  name: string;
  slug: string;
  description: string;
  price: number;
  venture: IVenture;
  gallery: IImage[];
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
