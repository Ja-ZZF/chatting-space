// src/contacts/entities/contact.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from 'src/users/entities/user.entity'; // 假设你的 User 实体路径是这样
import { Message } from 'src/message/entities/message.entity';

@Entity('contacts')
export class Contact {
  @PrimaryColumn('uuid')
  contact_id: string = uuidv4();

  @Column('uuid')
  user_a_id: string;

  @Column('uuid')
  user_b_id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamptz', { nullable: true })
  last_message_sent_at: Date | null;

  // 建立与 user_a_id 对应的用户关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_a_id', referencedColumnName: 'user_id' })
  userA: User;

  // 建立与 user_b_id 对应的用户关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_b_id', referencedColumnName: 'user_id' })
  userB: User;


  @OneToMany(() => Message, message => message.contact)
  messages: Message[];
}