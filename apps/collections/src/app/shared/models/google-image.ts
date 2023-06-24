export interface GoogleImageResponse {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  mime: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
}

export interface GoogleImageSearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  items: GoogleImageResponse[];
}

export interface GoogleImage {
  type: string;
  url: string;
  width: number;
  height: number;
  size: number;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
}
