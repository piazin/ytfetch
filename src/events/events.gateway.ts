import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: '*' })
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
