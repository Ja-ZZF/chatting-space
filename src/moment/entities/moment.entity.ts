import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique,} from 'typeorm';

export enum MomentVisibility{
    PUBLIC = 'public',
    FRIENDS = 'friends',
    PRIVATE = 'private',
    CUSTOM = 'custom',
}

@Entity('moments')
export class Moment {
    @PrimaryGeneratedColumn('uuid')
    moment_id : string;

    @ManyToOne(()=>User,user=>user.moments,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('text',{nullable:true})
    content : string;

    @Column('text',{array : true,nullable : true})
    media_urls : string[];

    @CreateDateColumn({type : 'timestamptz'})
    created_at : Date;

    @Column({
        type:'varchar',
        length:20,
        default : MomentVisibility.FRIENDS,
    })
    visibility : MomentVisibility;
}
