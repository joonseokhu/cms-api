export enum UserStatus {
  blocked = 'blocked',
  resigned = 'resigned',
  draft = 'draft',
  registered = 'registered',
  normal = 'normal',
  admin = 'admin',
  root = 'root',
}

export interface CreateUserProps {
  id: number,
  title: string,
  content: string,
  UserStatus: UserStatus,
  tags: string[],
}
