export enum PostStatus {
  deleted = 'deleted',
  blocked = 'blocked',
  draft = 'draft',
  secret = 'secret',
  public = 'public',
}

export enum PostType {
  ordinary = 'ordinary',
  notice = 'notice',
}

export enum ContentType {
  plainText = 'plainText',
  markdown = 'markdown',
  html = 'html',
}

export interface CreatePostProps {
  id: number,
  title: string,
  content: string,
  postStatus: PostStatus,
  postType: PostType,
  contentType: ContentType,
  tags: string[],
}
