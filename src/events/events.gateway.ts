import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: '*' })
/**
 * @description A gateway that handles the events of the application
 * @method pusblishEvent Publishes an event to all connected clients
 * @method handleConnection Handles a new connection
 */
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(EventsGateway.name);

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
    this.logger.log(`Client connected: ${client.id}`);
  }
}
