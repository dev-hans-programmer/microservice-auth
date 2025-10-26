import { Repository } from 'typeorm';
import { BaseRepository } from '../repository/base-repository';
import { Tenant } from '../entity/tenant';

export class TenantService extends BaseRepository<Tenant> {
  constructor(private readonly tenantRepository: Repository<Tenant>) {
    super(tenantRepository);
  }
}
