import Bull from 'bull';

export interface VideoProcessResponse {
  jobId: Bull.JobId;
}

export interface VideoJobResponse {
  status: Bull.JobStatus | string;
  progress: number;
  jobId: Bull.JobId;
}
