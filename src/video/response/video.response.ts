export class VideoAddedToQueueResponse {
  constructor(public jobId: string) {}
}

export class VideoGetDownloadStatusResponse {
  constructor(
    public jobId: string,
    public status: string,
    public progress: any,
  ) {}
}
