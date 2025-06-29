import { Injectable } from '@nestjs/common';
import { Message, MessageType } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { SCOPE_OPTIONS_METADATA } from '@nestjs/common/constants';
import { Friend } from 'src/friend/friend.entity';
import { FriendService } from 'src/friend/friend.service';

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(Message) private messageRepo : Repository<Message>,
        @InjectRepository(User) private userRepo : Repository<User>,
        //@InjectRepository(Friend) private friendRepo : Repository<Friend>,
        private readonly friendService : FriendService,
    ){}

    async saveMessage(data: {
    from_user_id: string;
    to_user_id: string;
    message_type: MessageType;
    content: string;
    url?: string;
    friend_id : string;
    }) {
    // 查询发消息用户
    const fromUser = await this.userRepo.findOne({ where: { user_id: data.from_user_id } });
    if (!fromUser) throw new Error('发消息用户不存在');

    // 查询收消息用户
    const toUser = await this.userRepo.findOne({ where: { user_id: data.to_user_id } });
    if (!toUser) throw new Error('接收消息用户不存在');

    const friend = this.friendService.findOne(data.friend_id);

    // 创建消息并关联friend
    const message = this.messageRepo.create({
        fromUser,
        toUser,
        friend,
        message_type: data.message_type,
        content: data.content,
        url: data.url || null,
    } as DeepPartial<Message>);

    // 保存消息
    return this.messageRepo.save(message);
    }

    async getChatHistory(userA:string,userB:string){
        return this.messageRepo.find({
            where:[
                {fromUser:{user_id :userA},toUser:{user_id:userB}},
                {fromUser:{user_id :userB},toUser:{user_id:userA}},
            ],
            relations: ['fromUser', 'toUser'],
            order:{created_at :'ASC'},
        });
    }


    async findAll(){
        return this.messageRepo.find({
            relations:['fromUser','toUser'],
            order:{
                created_at : 'DESC'
            }
        });
    }



}
