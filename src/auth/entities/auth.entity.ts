import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;
  @Column({ type: 'varchar', length: 255 })
  password: string;
  @Column({ type: 'varchar', length: 10 })
  nickname: string;
}
