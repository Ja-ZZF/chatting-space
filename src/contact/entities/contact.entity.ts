// src/contacts/entities/contact.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('contacts')
export class Contact {
  @PrimaryColumn('uuid')
  contact_id: string = uuidv4();

  @Column('uuid')
  user_a_id: string;

  @Column('uuid')
  user_b_id: string;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamptz', { nullable: true })
  last_message_sent_at: Date | null;
}