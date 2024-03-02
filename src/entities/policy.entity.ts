import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Policy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cpuId: string;

  @Column()
  expirationDate: Date;

  @Column()
  @OneToOne(() => User, (user) => user.username)
  username: string;
}
