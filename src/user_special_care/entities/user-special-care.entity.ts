// src/user-special-care/entities/user-special-care.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('user_special_cares')
@Unique(['owner_user_id', 'target_user_id'])
export class UserSpecialCare {
  @PrimaryGeneratedColumn('uuid')
  care_id: string;

  @Column({ type: 'uuid' })
  owner_user_id: string;

  @Column({ type: 'uuid' })
  target_user_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
