// import { optionalFindQuery, AddOption } from '@utils/db';
// import { getManager } from 'typeorm';
// import { Post } from '@models/post.model';
// import { PostTag } from '@models/postTag.model';
// import { User } from '@/api/interfaces';
// import { response } from '@/api';

// interface GetTagParams {
//   id?: number;
//   name?: string;
//   post?: number;
// }
// export const getTag = async (query: GetTagParams): Promise<Array<PostTag>|PostTag> => {
//   const db = getManager();
//   const {
//     id,
//     name,
//     post,
//   } = query;

//   if (id) {
//     const tag = await db.findOne(PostTag, {
//       where: { id },
//       relations: ['post'],
//     });
//     return tag;
//   }
//   const tags = await db.findAndCount(PostTag, {
//     where:
//   })
// }
