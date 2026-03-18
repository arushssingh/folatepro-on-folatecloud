export interface FileContent {
  content: string;
  language: string;
}

export interface FileSet {
  [filename: string]: FileContent;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  files?: FileSet;
}

export enum DeviceView {
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE'
}

export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE'
}

export enum AppView {
  GENERATOR = 'GENERATOR',
  COMMUNITY = 'COMMUNITY',
  PLAYGROUND = 'PLAYGROUND',
  MOBILE_APP = 'MOBILE_APP',
}

export enum ProjectType {
  WEBSITE = 'WEBSITE',
  MOBILE_APP = 'MOBILE_APP',
}