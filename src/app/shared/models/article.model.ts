import type { IBase } from './base.model';
import type { ITag } from './tag.model';
import type { IImage } from './image.model';
import type { IUser } from './user.model';

export interface IComment extends IBase {
  content: string;
  author: IUser;
  article: IArticle;
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
