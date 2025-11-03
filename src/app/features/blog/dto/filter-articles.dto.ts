export interface FilterArticlesDto {
  page: string | null;
  tags: string | null;
}

export interface CommentDto {
  articleId: string;
  content: string;
}
