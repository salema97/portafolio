import ProjectGalleryVideoThumb from "@/components/ProjectGalleryVideoThumb";
import ProjectVideoEmbed from "@/components/ProjectVideoEmbed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  canShowLiveDemo,
  getDemoStatusLabel,
  type DemoStatus,
  type ProjectAccess,
} from "@/lib/project-demo-status";
import { type ProjectSource } from "@/lib/project-sources";
import {
  getGallerySlideKey,
  type GallerySlide,
  type GalleryVideoSlide,
} from "@/lib/project-video";
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface ProjectModalData {
  title: string;
  description: string;
  gallerySlides: GallerySlide[];
  link?: string;
  sources: ProjectSource[];
  tags: string[];
  demoStatus: DemoStatus;
  access?: ProjectAccess;
  hasDemo?: boolean;
  platformLabel: string;
}

export interface ProjectModalLabels {
  demoAvailable: string;
  demoUnavailable: string;
  demoPrivate: string;
  viewDemo: string;
  close: string;
  galleryLabel: string;
  videoLabel: string;
}

interface ProjectDetailModalProps {
  project: ProjectModalData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: ProjectModalLabels;
}

/** Carousel + thumbnails; remounts when `project.title` changes so slide index resets without an effect. */
function ProjectModalGallery({
  project,
  labels,
}: {
  project: ProjectModalData;
  labels: ProjectModalLabels;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  const slideCount = project.gallerySlides.length;
  const hasMultipleSlides = slideCount > 1;
  const firstImage = project.gallerySlides.find((s) => s.type === "image");
  const videoSlide = project.gallerySlides.find(
    (s): s is GalleryVideoSlide => s.type === "video"
  );
  const posterForVideo =
    (firstImage?.type === "image" ? firstImage.src : undefined) ?? videoSlide?.video.thumbnailUrl;

  return (
    <div className="project-modal-gallery">
      <div className="project-modal-carousel">
        <Carousel
          setApi={setApi}
          className="h-full min-h-0 flex-1"
          opts={{ loop: hasMultipleSlides }}
        >
          <CarouselContent className="-ml-2 h-full">
            {project.gallerySlides.map((slide, index) => (
              <CarouselItem key={getGallerySlideKey(slide)} className="pl-2">
                <div
                  className={cn(
                    "project-modal-viewport",
                    slide.type === "video" && "project-modal-viewport--video"
                  )}
                >
                  {slide.type === "image" ? (
                    <img
                      src={slide.src}
                      alt={`${project.title} ${index + 1} of ${slideCount}`}
                      className="project-modal-image"
                      width={1280}
                      height={800}
                      decoding="async"
                    />
                  ) : activeIndex === index ? (
                    <ProjectVideoEmbed video={slide.video} title={project.title} />
                  ) : (
                    <div className="project-modal-video-poster" aria-hidden>
                      {slide.video.thumbnailUrl ? (
                        <img
                          src={slide.video.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover opacity-60"
                        />
                      ) : null}
                      <span className="project-modal-video-poster-play">{labels.videoLabel}</span>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {hasMultipleSlides && (
            <>
              <CarouselPrevious className="left-2 size-10 border-border/80 bg-card/95 sm:left-4" />
              <CarouselNext className="right-2 size-10 border-border/80 bg-card/95 sm:right-4" />
            </>
          )}
        </Carousel>
      </div>

      {hasMultipleSlides && (
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label={labels.galleryLabel}
        >
          {project.gallerySlides.map((slide, index) =>
            slide.type === "image" ? (
              <button
                key={`thumb-${getGallerySlideKey(slide)}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`${project.title} image ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "project-modal-thumb shrink-0",
                  activeIndex === index && "project-modal-thumb--active"
                )}
              >
                <img src={slide.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ) : (
              <button
                key={`thumb-${getGallerySlideKey(slide)}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`${project.title} ${labels.videoLabel}`}
                onClick={() => api?.scrollTo(index)}
                className="shrink-0"
              >
                <ProjectGalleryVideoThumb
                  posterSrc={slide.video.thumbnailUrl ?? posterForVideo}
                  label={labels.videoLabel}
                  active={activeIndex === index}
                />
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailModal({
  project,
  open,
  onOpenChange,
  labels,
}: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="project-modal-content gap-0 overflow-hidden p-0"
        aria-describedby="project-modal-description"
      >
        <div className="project-modal-layout">
          <div className="flex min-h-0 flex-col border-b border-border/60 md:border-b-0 md:border-r">
            <ProjectModalGallery key={project.title} project={project} labels={labels} />
          </div>

          <div className="flex min-h-0 flex-col overflow-y-auto p-4 sm:p-5 md:p-6">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="border border-primary/25 bg-primary/10 font-mono text-[10px] uppercase tracking-wider text-primary"
                >
                  {project.platformLabel}
                </Badge>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                    project.demoStatus === "live" &&
                      "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
                    project.demoStatus === "unavailable" &&
                      "border-border bg-muted/40 text-muted-foreground",
                    project.demoStatus === "private" &&
                      "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      project.demoStatus === "live" && "bg-emerald-400",
                      project.demoStatus === "unavailable" && "bg-muted-foreground/60",
                      project.demoStatus === "private" && "bg-amber-400"
                    )}
                    aria-hidden
                  />
                  {getDemoStatusLabel(project.demoStatus, labels)}
                </span>
              </div>
              <DialogTitle className="font-display text-xl leading-snug sm:text-2xl">
                {project.title}
              </DialogTitle>
              <DialogDescription
                id="project-modal-description"
                className="max-w-none whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem] sm:leading-7"
              >
                {project.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="border border-primary/20 bg-primary/10 text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              {canShowLiveDemo(project.demoStatus, project) && project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "min-h-11")}
                >
                  <ExternalLink className="size-4" aria-hidden />
                  {labels.viewDemo}
                </a>
              )}
              {project.sources.map((source) => (
                <a
                  key={`${source.url}-${source.label}`}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "min-h-11 border-primary/30"
                  )}
                >
                  <Github className="size-4" aria-hidden />
                  {source.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
