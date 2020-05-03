export enum ArticleStatus {
  deleted = 'deleted',
  blocked = 'blocked',
  draft = 'draft',
  secret = 'secret',
  public = 'public',
}

export enum ArticleType {
  ordinary = 'ordinary',
  notice = 'notice',
}

export enum ContentType {
  plainText = 'plainText',
  markdown = 'markdown',
  html = 'html',
}

export interface CreateArticleProps {
  id: number,
  title: string,
  content: string,
  articleStatus: ArticleStatus,
  articleType: ArticleType,
  contentType: ContentType,
  tags: string[],
}
