export interface FilterArticleDto {
  page: string | null;
  q: string | null;
  filter?: 'all' | 'published' | 'drafts' | 'highlighted';
}
