import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: 'http://127.0.0.1:5500/' })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  pusblishEvent(event: string, data: any, options?: { delay?: number }) {
    if (options?.delay) {
      setTimeout(() => {
        this.server.emit(event, data);
      }, options.delay);
      return;
    }

    this.server.emit(event, data);
  }

  handleConnection(client: any, ...args: any[]) {
    //
  }
}
