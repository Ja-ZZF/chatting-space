import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from './message.service';
import { MessageType } from './message.entity';

@WebSocketGateway({ cors: true })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}

  private onlineUsers = new Map<string, Socket>();

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(socket: Socket) {
    const user_id = socket.handshake.query.user_id as string;
    if (user_id) {
      this.onlineUsers.set(user_id, socket);
      console.log(`User connected: ${user_id}`);
    }
  }

  handleDisconnect(socket: Socket) {
    for (const [user_id, sock] of this.onlineUsers.entries()) {
      if (sock === socket) {
        this.onlineUsers.delete(user_id);
        console.log(`User disconnected: ${user_id}`);
        break;
      }
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: {
      from_user_id: string;
      to_user_id: string;
      message_type: MessageType;
      content: string;
      url?: string;
      friend_id : string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    // 保存消息到数据库
    const savedMessage = await this.messageService.saveMessage(data);

    // 发给接收方
    const receiverSocket = this.onlineUsers.get(data.to_user_id);
    if (receiverSocket) {
      receiverSocket.emit('receive_message', savedMessage);
    }

    console.log(data);

    // 回传给发送方（可选）
    socket.emit('message_sent', savedMessage);
  }
}
