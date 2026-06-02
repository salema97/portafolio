export type ProjectAccess = "public" | "private";

export type DemoStatus = "live" | "unavailable" | "private";

export function resolveDemoStatus(project: {
  access?: ProjectAccess;
  hasDemo?: boolean;
  link?: string;
}): DemoStatus {
  if (project.access === "private") return "private";
  if (project.hasDemo ?? Boolean(project.link)) return "live";
  return "unavailable";
}

export function getDemoStatusLabel(
  status: DemoStatus,
  labels: {
    demoAvailable: string;
    demoUnavailable: string;
    demoPrivate: string;
  }
): string {
  if (status === "live") return labels.demoAvailable;
  if (status === "private") return labels.demoPrivate;
  return labels.demoUnavailable;
}

export function canShowLiveDemo(
  status: DemoStatus,
  project: { link?: string; hasDemo?: boolean }
): boolean {
  return status === "live" && Boolean(project.link) && (project.hasDemo ?? true);
}
