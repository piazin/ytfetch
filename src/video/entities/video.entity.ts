export class Video {
    youtubeVideoUrl: string;
    qualityLabel: '1080p' | '720p' | '480p';
    type: 'mp4' | 'webm' | 'mp3';

    constructor(youtubeVideoUrl: string, qualityLabel: '1080p' | '720p' | '480p', type: 'mp4' | 'webm' | 'mp3') {
        this.youtubeVideoUrl = youtubeVideoUrl;
        this.qualityLabel = qualityLabel;
        this.type = type;
    }
}