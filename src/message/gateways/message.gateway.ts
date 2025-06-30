import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageService } from '../message.service';
import { MessageResponseDto } from '../dto/message.response.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // 根据你的前端地址设置
  },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  // 客户端连接
  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      client.join(userId); // 用户加入自己的房间
      console.log(`Client connected: ${client.id}, userId: ${userId}`);
    }
  }

  // 客户端断开
  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      client.leave(userId);
      console.log(`Client disconnected: ${client.id}, userId: ${userId}`);
    }
  }

  // 监听客户端发送的消息
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: { contact_id: string; sender_id: string; receiver_id: string; content: string; message_type: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const newMessage = await this.messageService.createMessage(payload);

    // 推送给接收方
    this.server.to(payload.receiver_id).emit('receiveMessage', newMessage);

    // 同时也发回给自己
    client.emit('receiveMessage', newMessage);
  }

  // 主动推送消息给某个用户（可用于后台触发）
  public emitMessageToUser(userId: string, message: MessageResponseDto) {
    this.server.to(userId).emit('receiveMessage', message);
  }
}