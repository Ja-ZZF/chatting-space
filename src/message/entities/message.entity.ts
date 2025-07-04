import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Contact } from 'src/contacts/entities/contact.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @Column('uuid')
  contact_id: string;

  @Column('uuid')
  sender_id: string;

  @Column('uuid')
  receiver_id: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum', // 使用 enum 类型代替 varchar 并限制取值范围
    enum: ['text', 'image', 'video', 'audio'],  // <-- 这里新增 audio
    default: 'text',
  })
  message_type: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // ✅ 新增字段：是否已读
  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  // 关系映射（可选）
  @ManyToOne(() => Contact, contact => contact.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;
}