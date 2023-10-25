import * as ytdl from 'ytdl-core';

function isQualityAccepted({ qualityLabel }: ytdl.videoFormat) {
  return ['1080p', '720p', '480p'].includes(qualityLabel);
}

function isFormatAccepted({ container }: ytdl.videoFormat) {
  return container === 'mp4';
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
    const video = await ytdl.getInfo(videoUrl);

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
