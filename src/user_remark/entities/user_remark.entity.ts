import { Column, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity('user_remarks')
@Unique(['owner_user_id', 'target_user_id'])
export class UserRemark {
  @PrimaryGeneratedColumn('uuid')
  remark_id: string;

  @Column({ type: 'uuid' })
  owner_user_id: string;

  @Column({ type: 'uuid' })
  target_user_id: string;

  @Column({ type: 'varchar', length: 100 })
  remark: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
