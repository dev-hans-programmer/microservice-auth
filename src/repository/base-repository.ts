import {
  Repository,
  DeepPartial,
  ObjectLiteral,
  FindOptionsWhere,
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
  ): Promise<TEntity | null> =>
    await this.repository.findOne({
      where,
    });

  public findAll = async (): Promise<TEntity[]> => await this.repository.find();

  public delete = async (id: number | string): Promise<void> => {
    await this.repository.delete(id);
  };
}
