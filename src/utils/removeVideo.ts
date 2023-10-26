import fs from 'node:fs/promises';
import { join } from 'node:path';

export const removeVideo = async (videoId: string) => {
  try {
    await fs.rm(join(process.cwd(), 'videos', videoId));
  } catch (error) {
    console.error(error);
  }
};
