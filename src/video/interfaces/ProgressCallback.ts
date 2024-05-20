export type ProgressCallback = ({
  percentage,
  downloadMinutes,
  downloadedMb,
  estimatedDownloadTime,
}: {
  percentage: number;
  downloadMinutes?: number;
  downloadedMb?: string;
  estimatedDownloadTime?: number;
}) => void;
