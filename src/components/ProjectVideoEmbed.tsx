import type { ParsedProjectVideo } from "@/lib/project-video";

interface ProjectVideoEmbedProps {
  video: ParsedProjectVideo;
  title: string;
}

export default function ProjectVideoEmbed({ video, title }: ProjectVideoEmbedProps) {
  if (video.provider === "file") {
    return (
      <video
        className="project-modal-video-native"
        src={video.embedUrl}
        controls
        playsInline
        preload="metadata"
        aria-label={title}
      />
    );
  }

  return (
    <iframe
      className="project-modal-video-frame"
      src={video.embedUrl}
      title={`${title} demo video`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
