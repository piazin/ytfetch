import * as ytdl from 'ytdl-core';

export async function getVideoDetails(videoUrl: string) {
  try {
    const { videoDetails } = await ytdl.getBasicInfo(videoUrl);
    return videoDetails;
  } catch (error) {
    throw error;
  }
}
