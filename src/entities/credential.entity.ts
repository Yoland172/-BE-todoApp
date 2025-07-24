import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

export enum Providers {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity()
export default class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provider: Providers; // 'local', 'google'..

  @Column()
  password: string;

  @ManyToOne(() => User, (user) => user.credentials)
  user: User;
}
