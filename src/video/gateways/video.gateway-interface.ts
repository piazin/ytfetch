import { Video } from "../entities/video.entity";

export interface VideoGatewayInterface {
    getVideoDetails(videoUrl: string): Promise<Video>
}