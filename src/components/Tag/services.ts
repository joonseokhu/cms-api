import lodash from 'lodash';
import { USER } from '@/api/interfaces';
import { useQuery, stringifyID } from '@utils/db';
import { Model, Document } from 'mongoose';
import createTagSchema, { Tag } from './model';

type ConstructorParams<T extends Document> = {
  name: string,
  entityName: string,
  entityModel: Model<T>,
};

type createTagParams = {
  name: string,
  description: string,
  user: USER,
};

class TagService<T extends Document> {
  Model: Model<Tag<T>>;

  EntityModel: Model<T>;

  constructor(params: ConstructorParams<T>) {
    this.Model = createTagSchema<T>(params.name, params.entityName);
    this.EntityModel = params.entityModel;
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

  registerTags = async (tagNames: string[], user: USER) => {
    const registeredTags = await this.Model.find({
      name: { $in: tagNames },
    });

    const results = lodash
      .difference(tagNames, registeredTags.map(tag => tag.name))
      .map(tagName => this.Model.create({
        name: tagName,
        description: '',
        createdBy: user.id,
      }));

    return Promise.all([
      ...registeredTags,
      ...results,
    ]);
  };

  getAllTags = async (name: string): Promise<[Tag<T>[], number]> => {
    const query = useQuery.findByString('name', name);
    const tags = await this.Model.find(query);
    const count = await this.Model.countDocuments(query);

    return [tags, count];
  };
}

export default TagService;
