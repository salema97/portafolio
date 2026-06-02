import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface ProjectGalleryVideoThumbProps {
  posterSrc?: string;
  label: string;
  active?: boolean;
  className?: string;
}

export default function ProjectGalleryVideoThumb({
  posterSrc,
  label,
  active = false,
  className,
}: ProjectGalleryVideoThumbProps) {
  return (
    <div
      className={cn(
        "project-modal-thumb project-modal-thumb--video relative shrink-0",
        active && "project-modal-thumb--active",
        className
      )}
    >
      {posterSrc ? (
        <img src={posterSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="h-full w-full bg-zinc-800" aria-hidden />
      )}
      <span className="project-modal-thumb-video-overlay" aria-hidden>
        <Play className="size-5 fill-current" />
      </span>
      <span className="project-modal-thumb-video-label">{label}</span>
    </div>
  );
}
