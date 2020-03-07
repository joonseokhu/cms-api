export enum PostStatus {
  deleted,
  blocked,
  draft,
  publish,
}

export enum PostType {
  ordinary,
  notice,
}

export enum ContentType {
  plainText,
  markdown,
  html,
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
