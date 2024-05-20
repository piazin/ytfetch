export class Video {
  title: string;
  thumbnails: Array<IThumbnails>;
  videoUrl: string;
  videoId: string;
  formats: Array<IFormats>;
}

interface IThumbnails {
  url: string;
  width: number;
  height: number;
}

interface IFormats {
  width: number;
  height: number;
  container: string;
  mimeType: string;
  qualityLabel: string;
  approxDurationMs: string | number;
}
