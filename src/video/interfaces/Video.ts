export interface Video {
  youtubeVideoUrl: string;
  qualityLabel: '1080p' | '720p' | '480p';
  type: 'mp4' | 'webm';
}
