
export interface Text2VideoParams {
  productImage: string;
  referImage: string;
}

export interface Text2VideoReq {
  templateUuId: string;
  params: Text2VideoParams;
}

export interface Text2VideoData {
  taskId: string;
}

export interface Text2VideoRes {
  code: number;
  message: string;
  data: Text2VideoData;
  requestId: string;
}

export interface VideoInfo {
  url: string;
  duration: string;
}
export interface VideoTaskData {
  taskId: string;
  status: 'CREATED' | 'IMAGE_PROCESSING' | 'IMAGE_SUCCESS' | 'VIDEO_PROCESSING' | 'VIDEO_SUCCESS' | 'FAILED' | 'CANCELLED';
  images?: string[];
  videos?: VideoInfo[];
  params?: Text2VideoParams;
}

export interface GetVideoByIdRes {
  code: number;
  message: string;
  data: VideoTaskData;
  requestId: string;
}