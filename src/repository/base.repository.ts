import {
  Repository,
  DeepPartial,
  ObjectLiteral,
  FindOptionsWhere,
  FindOneOptions,
} from 'typeorm';

export interface BaseEntityWithId extends ObjectLiteral {
  id: number | string;
}

export class BaseRepository<TEntity extends BaseEntityWithId> {
  constructor(private readonly repository: Repository<TEntity>) {}

  public create = async (data: DeepPartial<TEntity>): Promise<TEntity> => {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  };

  public findById = async (id: TEntity['id']): Promise<TEntity | null> =>
    await this.repository.findOne({
      where: { id } as FindOptionsWhere<TEntity>,
    });

  public findOne = async (
    where: FindOptionsWhere<TEntity>,
    relation?: string,
  ): Promise<TEntity | null> => {
    const options: FindOneOptions<TEntity> = { where };

    if (relation) {
      options.relations = [relation];
    }
    return await this.repository.findOne(options);
  };

  public findAll = async (): Promise<TEntity[]> => await this.repository.find();

  public delete = async (id: number | string): Promise<void> => {
    await this.repository.delete(id);
  };
}
