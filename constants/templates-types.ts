import { FileSet, ProjectType } from "../types";

export interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  projectType: ProjectType;
  files: FileSet;
}
