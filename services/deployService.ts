import { supabase } from '../lib/supabase';
import { FileSet, FileContent, Project } from '../types';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function bundleFilesToHtml(files: FileSet): string {
  const htmlFile = files['index.html'];
  if (!htmlFile) {
    throw new Error('No index.html found in project files');
  }

  let html = htmlFile.content;

  // Inline CSS files
  const cssFiles = Object.keys(files).filter(f => f.endsWith('.css'));
  cssFiles.forEach(cssFile => {
    const regex = new RegExp(
      `<link[^>]*href=["']\\.?\\/?${escapeRegExp(cssFile)}["'][^>]*>`,
      'gi'
    );
    html = html.replace(regex, `<style>\n/* ${cssFile} */\n${files[cssFile].content}\n</style>`);
  });

  // Inline JS files
  const jsFiles = Object.keys(files).filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
  jsFiles.forEach(jsFile => {
    const regex = new RegExp(
      `<script([^>]*)src=["']\\.?\\/?${escapeRegExp(jsFile)}["']([^>]*)>[\\s\\S]*?<\\/script>`,
      'gi'
    );
    html = html.replace(regex, (_match, attrs1, attrs2) => {
      return `<script${attrs1}${attrs2}>\n// ${jsFile}\n${files[jsFile].content}\n</script>`;
    });
  });

  return html;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  const { data } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  return data === null;
}

export async function deployProject(params: {
  slug: string;
  name: string;
  files: FileSet;
  compiledHtml: string;
  projectId?: string;
}): Promise<Project> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/deploy', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      slug: params.slug,
      name: params.name,
      files: params.files,
      compiledHtml: params.compiledHtml,
      projectId: params.projectId,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Deploy failed' }));
    throw new Error(body.error || 'Deploy failed');
  }

  const { project } = await res.json();
  return project as Project;
}

export async function fetchProjects(): Promise<Project[]> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/projects', { headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Failed to fetch projects' }));
    throw new Error(body.error || 'Failed to fetch projects');
  }

  const { projects } = await res.json();
  return projects as Project[];
}
