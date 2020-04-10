export enum UserStatus {
  blocked,
  resigned,
  draft,
  registered,
  normal,
  admin,
  root,
}

export interface CreateUserProps {
  id: number,
  title: string,
  content: string,
  UserStatus: UserStatus,
  tags: string[],
}
