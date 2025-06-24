export type FileType = {
  url: string;
  key: string;
  author?: string;
  metaData: {
    key: string;
    bucket: string;
    region: string;
    [key: string]: any;
  };
};
