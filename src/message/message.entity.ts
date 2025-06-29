import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Friend } from 'src/friend/friend.entity';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_user_id' })
  toUser: User;

  @ManyToOne(() => Friend, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'friend_id' })
  friend: Friend;

  @Column({
    type: 'enum',
    enum: MessageType,
  })
  message_type: MessageType;

  @Column()
  content: string;

  @Column({ nullable: true })
  url: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
