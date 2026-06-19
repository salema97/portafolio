export type VideoProvider = "youtube" | "vimeo" | "file";

export interface ParsedProjectVideo {
  url: string;
  provider: VideoProvider;
  embedUrl: string;
  thumbnailUrl?: string;
}

export type GalleryImageSlide = {
  type: "image";
  src: string;
};

export type GalleryVideoSlide = {
  type: "video";
  video: ParsedProjectVideo;
};

export type GallerySlide = GalleryImageSlide | GalleryVideoSlide;

export function getGallerySlideKey(slide: GallerySlide): string {
  if (slide.type === "image") return `image:${slide.src}`;
  return `video:${slide.video.url}`;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || null;
      }
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function extractVimeoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    const id = parts.find((part) => /^\d+$/.test(part));
    return id ?? null;
  } catch {
    return null;
  }
}

export function parseProjectVideo(url: string): ParsedProjectVideo | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeId = extractYouTubeId(trimmed);
  if (youtubeId) {
    return {
      url: trimmed,
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
    };
  }

  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return {
      url: trimmed,
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      thumbnailUrl: `https://vumbnail.com/${vimeoId}.jpg`,
    };
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
    return {
      url: trimmed,
      provider: "file",
      embedUrl: trimmed,
    };
  }

  return null;
}

export function buildGallerySlides(
  images: string[],
  videoUrl?: string | string[]
): GallerySlide[] {
  const slides: GallerySlide[] = images.map((src) => ({ type: "image", src }));

  if (!videoUrl) return slides;

  const urls = Array.isArray(videoUrl) ? videoUrl : [videoUrl];
  for (const url of urls) {
    const video = parseProjectVideo(url);
    if (video) slides.push({ type: "video", video });
  }

  return slides;
}
