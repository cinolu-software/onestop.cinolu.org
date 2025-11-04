export interface ArticleDto {
  id: string;
  title: string;
  published_at: Date;
  content: string;
  summary: string;
  tags: string[];
  author: string;
}
