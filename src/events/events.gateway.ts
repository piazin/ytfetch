import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Events } from './enums/events.enum';
import { removeVideo } from '@utils/removeVideo';

@WebSocketGateway({
  cors:
    process.env.NODE_ENV === 'development'
      ? '*'
      : 'https://yt-fetch.lucasouza.tech',
})
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

  @SubscribeMessage(Events.DELETE_VIDEO)
  async handleDeleteVide(@MessageBody('videoId') videoId: string) {
    await removeVideo(videoId);
  }
}
