import { Moment } from 'src/moment/entities/moment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToMany } from 'typeorm';

@Entity('users')
@Unique(['username']) // 唯一约束
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100, // 修改为 VARCHAR(100)
    nullable: false,
  })
  password_hash: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  display_name: string | null;

  @Column({
    type: 'varchar',
    length: 255, // 修改为 VARCHAR(255)
    nullable: true,
  })
  avatar_url: string | null;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at: Date;

  @OneToMany(()=>Moment,moment => moment.user)
  moments : Moment[];
}