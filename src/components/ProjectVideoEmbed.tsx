import type { ParsedProjectVideo } from "@/lib/project-video";

/** Minimal sandbox for YouTube/Vimeo embeds (scripts + presentation required for playback). */
const EMBED_IFRAME_SANDBOX =
  "allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox";

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
      >
        <track
          kind="captions"
          src="/captions/project-demo.vtt"
          srcLang="en"
          label="English captions"
          default
        />
      </video>
    );
  }

  return (
    <iframe
      className="project-modal-video-frame"
      src={video.embedUrl}
      title={`${title} demo video`}
      sandbox={EMBED_IFRAME_SANDBOX}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
