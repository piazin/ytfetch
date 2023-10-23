import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: 'http://127.0.0.1:5500/' })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  pusblishEvent(event: string, data: any) {
    this.server.emit(event, data);
  }

  handleConnection(client: any, ...args: any[]) {
    //
  }
}
