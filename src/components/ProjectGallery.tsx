import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectDetailModal, {
  type ProjectModalData,
  type ProjectModalLabels,
} from "@/components/ProjectDetailModal";
import {
  resolveProjectSources,
  type ProjectSource,
  type ProjectSourceInput,
} from "@/lib/project-sources";
import {
  canShowLiveDemo,
  getDemoStatusLabel,
  resolveDemoStatus,
  type DemoStatus,
  type ProjectAccess,
} from "@/lib/project-demo-status";
import {
  getPlatformLabel,
  getProjectPlatform,
  type ProjectPlatform,
} from "@/lib/project-platform";
import { buildGallerySlides, type GallerySlide } from "@/lib/project-video";
import { cn } from "@/lib/utils";
import { ChevronDown, Maximize2, Play } from "lucide-react";
import { useMemo, useState } from "react";

const FILTER_ALL = "__all__";

type ProjectCategory = "web" | "mobile" | "research";

interface Project extends ProjectSourceInput {
  title: string;
  description: string;
  descriptionLong?: string;
  image: string;
  images?: string[];
  video?: string;
  link?: string;
  access?: ProjectAccess;
  hasDemo?: boolean;
  platform?: ProjectPlatform;
  tags: string[];
}

interface ProjectGalleryLabels extends ProjectModalLabels {
  viewAll: string;
  filterAll: string;
  showMore: string;
  showLess: string;
  filterByTech: string;
  projectCount: string;
  emptyState: string;
  viewDetails: string;
  imageCount: string;
  categories: Record<ProjectCategory | "all", string>;
  platformKinds: Record<ProjectPlatform, string>;
  sourceKinds: Record<string, string>;
}

interface ProjectGalleryProps {
  projects: Project[];
  labels: ProjectGalleryLabels;
}

type EnrichedProject = Project & {
  category: ProjectCategory;
  platform: ProjectPlatform;
  platformLabel: string;
  galleryImages: string[];
  gallerySlides: GallerySlide[];
  hasVideo: boolean;
  demoStatus: DemoStatus;
  sources: ProjectSource[];
};

const MOBILE_TAGS = new Set(["Flutter", "Dart", "Android", "iOS"]);
const RESEARCH_TAGS = new Set(["Python", "YOLO", "Tesis", "Web Scraping", "Seguridad", "SQL"]);

function getProjectCategory(tags: string[]): ProjectCategory {
  const tagSet = new Set(tags);
  const hasMobile = [...tagSet].some((t) => MOBILE_TAGS.has(t));
  const hasResearch = [...tagSet].some((t) => RESEARCH_TAGS.has(t));
  if (hasResearch && !tagSet.has("Flutter") && !tagSet.has("React")) return "research";
  if (hasMobile && !tagSet.has("Next.js") && !tagSet.has("React")) return "mobile";
  return "web";
}

function enrichProject(
  project: Project,
  sourceKinds: Record<string, string>,
  platformKinds: Record<ProjectPlatform, string>
): EnrichedProject {
  const galleryImages =
    project.images && project.images.length > 0 ? project.images : [project.image];
  const demoStatus = resolveDemoStatus(project);
  const gallerySlides = buildGallerySlides(galleryImages, project.video);
  const platform = getProjectPlatform(project.tags, project.platform);

  return {
    ...project,
    category: getProjectCategory(project.tags),
    platform,
    platformLabel: getPlatformLabel(platform, platformKinds),
    galleryImages,
    gallerySlides,
    hasVideo: gallerySlides.some((slide) => slide.type === "video"),
    demoStatus,
    sources: resolveProjectSources(project, sourceKinds),
  };
}

const CATEGORY_ORDER: (ProjectCategory | "all")[] = ["all", "web", "mobile", "research"];

export default function ProjectGallery({ projects, labels }: ProjectGalleryProps) {
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [techFilter, setTechFilter] = useState(FILTER_ALL);
  const [visibleCount, setVisibleCount] = useState(6);
  const [techOpen, setTechOpen] = useState(false);
  const [selected, setSelected] = useState<EnrichedProject | null>(null);

  const projectsWithCategory = useMemo(
    () => projects.map((p) => enrichProject(p, labels.sourceKinds, labels.platformKinds)),
    [projects, labels.sourceKinds, labels.platformKinds]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<"all" | ProjectCategory, number> = {
      all: projects.length,
      web: 0,
      mobile: 0,
      research: 0,
    };
    for (const p of projectsWithCategory) {
      counts[p.category] += 1;
    }
    return counts;
  }, [projectsWithCategory, projects.length]);

  const techTags = useMemo(() => {
    const tags = new Set<string>();
    const pool =
      category === "all"
        ? projectsWithCategory
        : projectsWithCategory.filter((p) => p.category === category);
    pool.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [projectsWithCategory, category]);

  const filteredProjects = useMemo(() => {
    let list =
      category === "all"
        ? projectsWithCategory
        : projectsWithCategory.filter((p) => p.category === category);

    if (techFilter !== FILTER_ALL) {
      list = list.filter((p) => p.tags.includes(techFilter));
    }
    return list;
  }, [projectsWithCategory, category, techFilter]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const filterBtnClass = (active: boolean) =>
    `shrink-0 rounded-full min-h-11 px-4 border text-sm font-medium transition-[color,background,border-color,transform] duration-150 active:scale-[0.98] ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
    }`;

  const resetFilters = () => {
    setCategory("all");
    setTechFilter(FILTER_ALL);
    setVisibleCount(6);
  };

  const modalProject: ProjectModalData | null = selected
    ? {
        title: selected.title,
        description: selected.descriptionLong ?? selected.description,
        gallerySlides: selected.gallerySlides,
        link: selected.link,
        sources: selected.sources,
        tags: selected.tags,
        demoStatus: selected.demoStatus,
        access: selected.access,
        hasDemo: selected.hasDemo,
        platformLabel: selected.platformLabel,
      }
    : null;

  const modalLabels: ProjectModalLabels = {
    demoAvailable: labels.demoAvailable,
    demoUnavailable: labels.demoUnavailable,
    demoPrivate: labels.demoPrivate,
    viewDemo: labels.viewDemo,
    close: labels.close,
    galleryLabel: labels.galleryLabel,
    videoLabel: labels.videoLabel,
  };

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Filter projects by type"
      >
        {CATEGORY_ORDER.map((key) => (
          <Button
            key={key}
            type="button"
            variant="outline"
            size="sm"
            role="tab"
            aria-selected={category === key}
            onClick={() => {
              setCategory(key);
              setTechFilter(FILTER_ALL);
              setVisibleCount(6);
            }}
            className={filterBtnClass(category === key)}
          >
            {labels.categories[key]}
            <span className="ml-1.5 tabular-nums opacity-80">({categoryCounts[key]})</span>
          </Button>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/30 p-4 sm:p-5">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setTechOpen((o) => !o)}
          aria-expanded={techOpen}
        >
          <span className="text-sm font-medium text-foreground">{labels.filterByTech}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${techOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>

        {techOpen && (
          <div
            className="mt-4 flex max-h-40 flex-wrap gap-2 overflow-y-auto border-t border-border/60 pt-4"
            role="tablist"
            aria-label="Filter projects by technology"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              role="tab"
              aria-selected={techFilter === FILTER_ALL}
              onClick={() => {
                setTechFilter(FILTER_ALL);
                setVisibleCount(6);
              }}
              className={filterBtnClass(techFilter === FILTER_ALL)}
            >
              {labels.filterAll}
            </Button>
            {techTags.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant="outline"
                size="sm"
                role="tab"
                aria-selected={techFilter === tag}
                onClick={() => {
                  setTechFilter(tag);
                  setVisibleCount(6);
                }}
                className={filterBtnClass(techFilter === tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {labels.projectCount.replace("{count}", String(filteredProjects.length))}
      </p>

      {displayedProjects.length === 0 ? (
        <div className="card-premium flex flex-col items-center gap-4 px-6 py-12 text-center">
          <p className="text-muted-foreground">{labels.emptyState}</p>
          <Button type="button" variant="outline" onClick={resetFilters} className="min-h-11">
            {labels.filterAll}
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {displayedProjects.map((project) => (
            <article key={`${category}-${techFilter}-${project.title}`}>
              <button
                type="button"
                className="project-card group w-full text-left"
                onClick={() => setSelected(project)}
                aria-label={`${labels.viewDetails}: ${project.title}`}
              >
                <div className="project-card__media">
                  <img
                    src={project.galleryImages[0]}
                    alt={project.title}
                    className="project-card__image"
                    loading="lazy"
                    width={640}
                    height={400}
                  />
                  <div className="project-card__shine" aria-hidden />
                  <span
                    className={cn(
                      "project-card__demo",
                      project.demoStatus === "live" && "project-card__demo--yes",
                      project.demoStatus === "unavailable" && "project-card__demo--no",
                      project.demoStatus === "private" && "project-card__demo--private"
                    )}
                  >
                    <span className="project-card__demo-dot" aria-hidden />
                    {getDemoStatusLabel(project.demoStatus, labels)}
                  </span>
                  <Badge
                    variant="secondary"
                    className="project-card__category border border-primary/25 bg-black/55 font-mono text-[10px] uppercase tracking-wider text-primary backdrop-blur-sm"
                  >
                    {project.platformLabel}
                  </Badge>
                  {project.hasVideo && (
                    <span className="project-card__video">
                      <Play className="size-3 fill-current" aria-hidden />
                      {labels.videoLabel}
                    </span>
                  )}
                  <span className="project-card__expand">
                    <Maximize2 className="size-4" aria-hidden />
                    {labels.viewDetails}
                  </span>
                </div>

                <div className="project-card__body">
                  <h3 className="font-display text-lg leading-snug text-foreground">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="border border-primary/15 bg-primary/5 text-xs text-primary"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs text-muted-foreground">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                    {project.galleryImages.length > 1 && (
                      <Badge variant="secondary" className="text-xs text-muted-foreground">
                        {labels.imageCount.replace("{count}", String(project.galleryImages.length))}
                      </Badge>
                    )}
                    {project.hasVideo && (
                      <Badge
                        variant="secondary"
                        className="border border-primary/25 bg-primary/10 text-xs text-primary"
                      >
                        {labels.videoLabel}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      )}

      {(hasMore || (visibleCount > 6 && filteredProjects.length > 6)) && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={
              hasMore
                ? () => setVisibleCount((prev) => prev + 6)
                : () => {
                    setVisibleCount(6);
                    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                  }
            }
            className="min-h-11 gap-2 rounded-full border-primary/30 px-8 text-primary hover:bg-primary/5"
          >
            {hasMore ? labels.showMore : labels.showLess}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${hasMore ? "" : "rotate-180"}`}
              aria-hidden
            />
          </Button>
        </div>
      )}

      <ProjectDetailModal
        project={modalProject}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        labels={modalLabels}
      />
    </div>
  );
}
