import * as ytdl from 'ytdl-core';

function isQualityAccepted({ qualityLabel }: ytdl.videoFormat) {
  return ['1080p', '720p', '480p'].includes(qualityLabel);
}

function isFormatAccepted({ container }: ytdl.videoFormat) {
  return container === 'mp4' || container === 'webm';
}

function removeDuplicateFormats(originalFormatArray: ytdl.videoFormat[]) {
  const formats = originalFormatArray.map(({ qualityLabel }) => qualityLabel);
  const filtered = originalFormatArray.filter(
    ({ qualityLabel }, index) => !formats.includes(qualityLabel, index + 1),
  );
  return filtered;
}

export async function getVideoDetails(videoUrl: string) {
  try {
    const cookie =
      'SIDCC=AKEyXzVXXkle56gzr_gQAIGN_CLQai5P1U9lhSwIZ2Y6pE0GP1CTdm7bi90Xc5FJdfFUml-CcA; __Secure-1PSIDCC=AKEyXzUAeQ09qr7xjJvY5jDi3GLKRAmbTQDqBMsrU_76d2LGl9TsG4WfeLKTdizRa8sYxUhEpV4; __Secure-3PSIDCC=AKEyXzXF2W6of4ae5RdwMALtUmYgfLpZWZ5zVwCrgF1pEk_2jBlAmN5tfhlz1RlKBefBs8mgrP8;';

    const video = await ytdl.getInfo(videoUrl, {
      requestOptions: {
        headers: {
          cookie,
        },
      },
    });

    const formats = removeDuplicateFormats(video.formats)
      .filter((f, i) => isFormatAccepted(f) && isQualityAccepted(f))
      .map(
        ({
          width,
          height,
          container,
          mimeType,
          qualityLabel,
          approxDurationMs,
        }) => ({
          width,
          height,
          container,
          mimeType,
          qualityLabel,
          approxDurationMs,
        }),
      );

    return {
      ...video.videoDetails,
      formats,
    };
  } catch (error) {
    throw error;
  }
}
