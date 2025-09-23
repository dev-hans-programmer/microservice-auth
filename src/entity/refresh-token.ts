import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @ManyToOne(() => User) // Many refresh tokens belong to User
  user!: User;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
