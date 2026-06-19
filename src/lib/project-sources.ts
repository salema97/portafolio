export type ProjectSourceKind = "web" | "backend" | "app" | "repo";

export interface ProjectSource {
  url: string;
  label?: string;
  kind?: ProjectSourceKind;
}

export interface ProjectSourceInput {
  sources?: ProjectSource[];
  github?: string;
  githubBackend?: string;
}

const MAX_SOURCES = 3;

export function resolveProjectSources(
  project: ProjectSourceInput,
  kindLabels: Record<string, string>
): ProjectSource[] {
  if (project.sources?.length) {
    return project.sources.slice(0, MAX_SOURCES).map((source) => ({
      ...source,
      label: getSourceLabel(source, kindLabels),
    }));
  }

  const legacy: ProjectSource[] = [];

  if (project.github) {
    legacy.push({
      url: project.github,
      kind: "repo",
      label: getSourceLabel({ kind: "repo" }, kindLabels),
    });
  }

  if (project.githubBackend) {
    legacy.push({
      url: project.githubBackend,
      kind: "backend",
      label: getSourceLabel({ kind: "backend" }, kindLabels),
    });
  }

  return legacy.slice(0, MAX_SOURCES);
}

export function getSourceLabel(
  source: Pick<ProjectSource, "label" | "kind">,
  kindLabels: Record<string, string>
): string {
  if (source.label?.trim()) return source.label.trim();
  if (source.kind && kindLabels[source.kind]) return kindLabels[source.kind];
  return kindLabels.repo ?? "Repository";
}
