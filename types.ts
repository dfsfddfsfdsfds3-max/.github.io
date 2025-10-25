
export enum InputType {
  TEXT = 'text',
  IMAGE = 'image',
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}
