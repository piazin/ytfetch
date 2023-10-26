import internal from 'stream';
import { ProgressCallback } from './downloadVideo';

export function traceStreamProgress(
  stream: internal.Readable,
  cb: ProgressCallback,
) {
  let startTime: number;
  stream.once('response', () => {
    startTime = Date.now();
  });

  stream.on('progress', (_, downloaded, total) => {
    const percent = downloaded / total;
    const downloadMinutes = (Date.now() - startTime) / 1000 / 60;
    const estimatedDownloadTime = downloadMinutes / percent - downloadMinutes;

    cb({
      percentage: percent,
      downloadMinutes,
      downloadedMb: `${(downloaded / 1024 / 1024).toFixed(2)}MB`,
      estimatedDownloadTime,
    });
  });
}
