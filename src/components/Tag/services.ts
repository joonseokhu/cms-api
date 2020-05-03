import { USER } from '@/api/interfaces';
import { useQuery } from '@utils/db';
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

  createTag = async (params: createTagParams) => this.Model.create({
    name: params.name,
    description: params.description,
    createdBy: params.user.id,
  });

  getAllTags = async (name: string): Promise<[Tag<T>[], number]> => {
    const query = useQuery.findByString('name', name);
    const tags = await this.Model.find(query);
    const count = await this.Model.countDocuments(query);

    return [tags, count];
  };

  getTagsOfEntity = async (entityID: string): Promise<[Tag<T>[], number]> => {
    const entity = await this.EntityModel.findOne({ _id: entityID } as any);
    const tags: Tag<T>[] = ((entity as any).tags as any);

    const query = {
      _id: {
        $in: tags,
      },
    };

    const result = await this.Model.find(query);
    const count = await this.Model.countDocuments(query);

    return [result, count];
  };

  getQueryToGetEntitiesOfTag = async (tagID: string) => {
    if (!tagID) return {};
    const tag = await this.Model.findOne({ _id: tagID });
    const { entities } = tag;

    const query = {
      _id: {
        $in: entities,
      },
    };
    return query;
  };
}

export default TagService;
