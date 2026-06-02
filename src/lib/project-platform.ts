export type ProjectPlatform = "web" | "crossplatform" | "app";

const MOBILE_TAGS = new Set(["Flutter", "Dart", "Android", "iOS"]);
const WEB_FRONTEND_TAGS = new Set([
  "React",
  "Next.js",
  "Vite",
  "Angular",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
]);

export function getProjectPlatform(
  tags: string[],
  explicit?: ProjectPlatform
): ProjectPlatform {
  if (explicit) return explicit;

  const tagSet = new Set(tags);
  const hasMobile = [...tagSet].some((tag) => MOBILE_TAGS.has(tag));
  const hasWebFrontend = [...tagSet].some((tag) => WEB_FRONTEND_TAGS.has(tag));

  if (hasMobile && hasWebFrontend) return "crossplatform";
  if (hasMobile) return "app";
  return "web";
}

export function getPlatformLabel(
  platform: ProjectPlatform,
  labels: Record<ProjectPlatform, string>
): string {
  return labels[platform];
}
