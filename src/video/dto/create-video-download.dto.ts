import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export class CreateVideoDownloadDto {
  youtubeVideoUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Qualidade inválida' })
  qualityLabel: '1080p' | '720p' | '480p';

  @IsString()
  type: 'mp4' | 'webm';
}
