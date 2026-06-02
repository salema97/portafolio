import { useEffect, useRef, useState } from "react";
import { FaAward, FaBuilding, FaCalendarAlt, FaExternalLinkAlt, FaTerminal } from "react-icons/fa";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  description?: string;
  image: string;
  tags: string[];
  url?: string;
}

interface CertificationsProps {
  items: CertificationItem[];
  title: string;
  verifyText: string;
}

function getCertificationKey(cert: CertificationItem): string {
  if (cert.credentialId) return `cred:${cert.credentialId}`;
  if (cert.url) return `url:${cert.url}`;
  return `img:${cert.image}`;
}

type CertOrientation = "portrait" | "landscape";

function useCertOrientation(src: string): CertOrientation {
  const [orientation, setOrientation] = useState<CertOrientation>("landscape");

  useEffect(() => {
    if (!src) return;
    const probe = new Image();
    probe.onload = () => {
      setOrientation(
        probe.naturalHeight > probe.naturalWidth ? "portrait" : "landscape"
      );
    };
    probe.src = src;
  }, [src]);

  return orientation;
}

function CertificationMedia({
  src,
  label,
  eager,
  onOpen,
}: {
  src: string;
  label: string;
  eager?: boolean;
  onOpen: () => void;
}) {
  const orientation = useCertOrientation(src);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className={cn(
        "cert-card__trigger",
        orientation === "portrait"
          ? "cert-card__trigger--portrait"
          : "cert-card__trigger--landscape"
      )}
      aria-label={label}
    >
      <span
        className="cert-card__bg"
        style={{ backgroundImage: `url(${src})` }}
        aria-hidden
      />
      {eager ? (
        <img src={src} alt="" className="sr-only" loading="eager" decoding="async" />
      ) : null}
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
      <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/65 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        View
      </span>
    </button>
  );
}

function CertPreviewImage({
  cert,
  orientation,
}: {
  cert: CertificationItem;
  orientation: CertOrientation;
}) {
  return (
    <img
      src={cert.image}
      alt={cert.name}
      className={cn(
        "cert-preview__img",
        orientation === "portrait"
          ? "cert-preview__img--portrait"
          : "cert-preview__img--landscape"
      )}
    />
  );
}

function CertificationPreviewDialog({
  preview,
  onOpenChange,
}: {
  preview: CertificationItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const orientation = useCertOrientation(preview?.image ?? "");

  return (
    <Dialog open={preview !== null} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "cert-preview-dialog z-[100] border-none bg-transparent p-3 sm:p-4",
          orientation === "landscape"
            ? "cert-preview-dialog--landscape"
            : "cert-preview-dialog--portrait"
        )}
      >
        {preview ? (
          <>
            <DialogTitle className="sr-only">{preview.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Image of {preview.name} certification
            </DialogDescription>
            <CertPreviewImage cert={preview} orientation={orientation} />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default function Certifications({ items, verifyText }: CertificationsProps) {
  const [preview, setPreview] = useState<CertificationItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const measure = () => setSlideWidth(node.clientWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  const goPrev = () => {
    setActiveIndex((index) => (index <= 0 ? items.length - 1 : index - 1));
  };

  const goNext = () => {
    setActiveIndex((index) => (index >= items.length - 1 ? 0 : index + 1));
  };

  return (
    <>
      <div className="cert-carousel relative mx-auto w-full max-w-5xl px-10 sm:px-12 md:px-14">
        <div
          ref={viewportRef}
          className="cert-carousel__viewport overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Certifications"
        >
          <div
            className="cert-carousel__track flex transition-transform duration-300 ease-out"
            style={{
              transform:
                slideWidth > 0
                  ? `translate3d(-${activeIndex * slideWidth}px, 0, 0)`
                  : undefined,
            }}
          >
            {items.map((cert, index) => (
              <article
                key={getCertificationKey(cert)}
                className="cert-carousel__slide shrink-0 grow-0"
                style={{ width: slideWidth > 0 ? slideWidth : "100%" }}
                aria-hidden={activeIndex !== index}
              >
                <Card className="card-premium cert-card gap-0 overflow-hidden py-0 shadow-none transition-shadow duration-300 hover:shadow-lg">
                  <CardContent className="flex h-full min-h-0 flex-col p-0">
                    <div className="cert-card__layout flex min-h-0 flex-1 flex-col md:flex-row">
                      <div className="cert-card__media group relative shrink-0 overflow-hidden md:flex-[0_0_42%]">
                        <CertificationMedia
                          src={cert.image}
                          label={`View ${cert.name} certificate`}
                          eager={index === 0}
                          onOpen={() => setPreview(cert)}
                        />
                      </div>

                      <div className="cert-card__body flex min-h-0 w-full flex-1 flex-col justify-center overflow-y-auto p-5 custom-scrollbar sm:p-6 md:p-8">
                        <div className="mb-2">
                          <h3 className="font-display mb-2 line-clamp-2 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                            {cert.name}
                          </h3>
                          <div className="mb-1 flex items-center text-muted-foreground">
                            <FaBuilding className="mr-2 size-4 text-primary" />
                            <span className="text-sm font-medium">{cert.issuer}</span>
                          </div>
                          <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-1.5 size-3.5" />
                              {cert.date}
                            </div>
                            {cert.credentialId && (
                              <div className="flex items-center">
                                <FaAward className="mr-1.5 size-3.5" />
                                ID: {cert.credentialId}
                              </div>
                            )}
                          </div>
                        </div>

                        {cert.description && (
                          <p className="mb-6 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                            {cert.description}
                          </p>
                        )}

                        <div className="mb-6 mt-auto flex flex-wrap gap-2">
                          {cert.tags.map((tag) => (
                            <span
                              key={`${getCertificationKey(cert)}-tag-${tag}`}
                              className="flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                            >
                              <FaTerminal className="mr-1.5 size-3" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        {cert.url && (
                          <div className="mt-4">
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98]"
                            >
                              <FaExternalLinkAlt className="mr-2 size-4" />
                              {verifyText}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>

        {!preview && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full border-border bg-card/95 shadow-md hover:bg-primary hover:text-primary-foreground"
              onClick={goPrev}
              aria-label="Previous certification"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full border-border bg-card/95 shadow-md hover:bg-primary hover:text-primary-foreground"
              onClick={goNext}
              aria-label="Next certification"
            >
              <ArrowRight className="size-4" />
            </Button>
          </>
        )}
      </div>

      <CertificationPreviewDialog
        preview={preview}
        onOpenChange={(open) => !open && setPreview(null)}
      />
    </>
  );
}
