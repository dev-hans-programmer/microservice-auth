import { Repository } from 'typeorm';
import { User } from '../entity/user';
import { BaseRepository } from '../repository/base-repository';

export class UserService extends BaseRepository<User> {
  constructor(private readonly userRepository: Repository<User>) {
    super(userRepository);
  }
}
