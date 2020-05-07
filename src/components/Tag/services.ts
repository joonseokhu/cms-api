import lodash from 'lodash';
import { USER } from '@/api/interfaces';
import { useQuery, stringifyID } from '@utils/db';
import { Model, Document } from 'mongoose';
import createTagSchema, { Tag } from './model';

type entityParams<T extends Document> = {
  name: string,
  model: Model<T>,
};

type createTagParams = {
  name: string,
  description: string,
  user: USER,
};

class TagService<T extends Document> {
  Model: Model<Tag<T>>;

  EntityModel: Model<T>;

  constructor(name: string, entity: entityParams<T>) {
    this.Model = createTagSchema<T>(name, entity.name);
    this.EntityModel = entity.model;
  }

  createTag = async (params: createTagParams) => {
    const prev = await this.Model.findOne({ name: params.name });
    if (prev) return prev;
    return this.Model.create({
      name: params.name,
      description: params.description,
      createdBy: params.user.id,
    });
  };

  // setEntityToTags = async (entityID: string, tags: Tag<T>[]): Promise<Array<{id: Tag<T>, method: string, status: boolean}>> => {
  //   const prevTags: Tag<T>[] = await this.EntityModel.findOne({ _id: entityID } as any).then((entity: any) => (
  //     entity.tags.map(tag => stringifyID(tag))
  //   ));
  //   const nextTags = tags.map(tag => stringifyID(tag));
  //   const tagsToBeRemoved = lodash.difference(prevTags, nextTags);
  //   const tagsToBeAdded = lodash.difference(nextTags, prevTags);
  //   const removedPromise = Promise.all(tagsToBeRemoved.map(async tag => {
  //     const prevEntities = await this.Model.findOne({ _id: tag }).then(res => (
  //       res.entities.map(entity => stringifyID(entity))
  //     ));
  //     const nextEntities = prevEntities.filter(entity => entity !== entityID);
  //     const result = await this.Model.updateOne({ _id: tag }, { entities: nextEntities });
  //     return {
  //       id: tag,
  //       method: 'remove',
  //       status: !!result.ok,
  //     };
  //   }));
  //   const addedPromise = Promise.all(tagsToBeAdded.map(async tag => {
  //     const prevEntities = await this.Model.findOne({ _id: tag }).then(res => (
  //       res.entities.map(entity => stringifyID(entity))
  //     ));
  //     const nextEntities = lodash.uniq(prevEntities.concat(entityID));
  //     const result = await this.Model.updateOne({ _id: tag }, { entities: nextEntities });
  //     return {
  //       id: tag,
  //       method: 'add',
  //       status: !!result.ok,
  //     };
  //   }));
  //   const removed = await removedPromise;
  //   const added = await addedPromise;
  //   return [...removed, ...added];
  // };

  getAllTags = async (name: string): Promise<[Tag<T>[], number]> => {
    const query = useQuery.findByString('name', name);
    const tags = await this.Model.find(query);
    const count = await this.Model.countDocuments(query);

    return [tags, count];
  };

  // getTagsOfEntity = async (entityID: string): Promise<[Tag<T>[], number]> => {
  //   const entity = await this.EntityModel.findOne({ _id: entityID } as any);
  //   const tags: Tag<T>[] = ((entity as any).tags as any);

  //   const query = {
  //     _id: {
  //       $in: tags,
  //     },
  //   };

  //   const result = await this.Model.find(query);
  //   const count = await this.Model.countDocuments(query);

  //   return [result, count];
  // };

  // getQueryToGetEntitiesOfTag = async (tagID: string) => {
  //   if (!tagID) return {};
  //   const tag = await this.Model.findOne({ _id: tagID });
  //   const { entities } = tag;

  //   const query = {
  //     // _id: {
  //     //   $in: entities,
  //     // },
  //     tags: tagID,
  //   };
  //   return query;
  // };
}

export default TagService;
