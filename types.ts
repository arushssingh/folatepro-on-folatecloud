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
  MY_PROJECTS = 'MY_PROJECTS',
}

export enum ProjectType {
  WEBSITE = 'WEBSITE',
  MOBILE_APP = 'MOBILE_APP',
}

export interface Project {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  files: FileSet;
  compiled_html: string;
  created_at: string;
  updated_at: string;
}