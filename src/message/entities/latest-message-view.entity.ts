// src/messages/entities/latest-message-view.entity.ts
import { Entity, PrimaryColumn, Column, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'latest_messages_per_contact', // 必须与数据库中的视图名一致
  schema: 'public', // 如果你的视图在 public schema 下可省略
})
export class LatestMessageView {
  @PrimaryColumn()
  contact_id: string;

  @Column()
  message_id: string;

  @Column()
  sender_id: string;

  @Column()
  receiver_id: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ nullable: true })
  message_type: string | null;

  @Column('timestamptz', { nullable: true })
  created_at: Date | null;
}