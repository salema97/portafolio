import { useEffect, useState } from "react";
import { FaAward, FaBuilding, FaCalendarAlt, FaExternalLinkAlt, FaTerminal } from "react-icons/fa";

import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "../ui/dialog";

export interface CertificationItem {
  name: string
  issuer: string
  date: string
  credentialId?: string
  description?: string
  image: string
  tags: string[]
  url?: string
}

interface CertificationsProps {
  items: CertificationItem[]
  title: string
  verifyText: string
}

type CertOrientation = "portrait" | "landscape";

function getCertificationKey(cert: CertificationItem): string {
  if (cert.credentialId) return `cred:${cert.credentialId}`;
  if (cert.url) return `url:${cert.url}`;
  return `img:${cert.image}`;
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
  const [orientation, setOrientation] = useState<CertOrientation>("landscape");

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => {
      setOrientation(
        probe.naturalHeight > probe.naturalWidth ? "portrait" : "landscape"
      );
    };
    probe.src = src;
  }, [src]);

  return (
    <button
      type="button"
      onClick={onOpen}
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

/** Let clicks on the cert image open the dialog instead of starting a carousel drag. */
function shouldStartCarouselDrag(_api: unknown, event: MouseEvent | TouchEvent): boolean {
  const target = event.target;
  if (!(target instanceof Element)) return true;
  return !target.closest(".cert-card__trigger");
}

export default function Certifications({ items, verifyText }: CertificationsProps) {
  const [preview, setPreview] = useState<CertificationItem | null>(null);

  return (
    <>
    <div className="relative mx-auto w-full max-w-5xl px-0 sm:px-2">
      <Carousel
        opts={{ loop: true, watchDrag: shouldStartCarouselDrag }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((cert) => (
            <CarouselItem key={getCertificationKey(cert)} className="basis-full">
                <Card className="card-premium cert-card gap-0 overflow-hidden py-0 shadow-none transition-[transform,box-shadow] duration-300 hover:-translate-y-1">
                  <CardContent className="flex h-full min-h-0 flex-col p-0">
                    <div className="cert-card__layout flex min-h-0 flex-1 flex-col md:flex-row">
                      <div className="cert-card__media group relative shrink-0 overflow-hidden md:flex-[0_0_42%]">
                        <CertificationMedia
                          src={cert.image}
                          label={`View ${cert.name} certificate`}
                          eager={items[0] === cert}
                          onOpen={() => setPreview(cert)}
                        />
                      </div>

                      {/* Right: Info */}
                      <div className="cert-card__body flex min-h-0 w-full flex-1 flex-col justify-center overflow-y-auto p-5 custom-scrollbar sm:p-6 md:p-8">
                        <div className="mb-2">
                          <h3 className="font-display mb-2 line-clamp-2 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                            {cert.name}
                          </h3>
                          <div className="flex items-center text-muted-foreground mb-1">
                             <FaBuilding className="mr-2 size-4 text-primary" />
                             <span className="text-sm font-medium">{cert.issuer}</span>
                          </div>
                           <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
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
                           <p className="text-muted-foreground mb-6 text-sm leading-relaxed line-clamp-4">
                            {cert.description}
                           </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                          {cert.tags.map((tag) => (
                            <span
                              key={`${getCertificationKey(cert)}-tag-${tag}`}
                              className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center"
                            >
                              <FaTerminal className="mr-1.5 size-3" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Button */}
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 border-border bg-card/95 shadow-md hover:bg-primary hover:text-primary-foreground sm:left-2 md:-left-12" />
        <CarouselNext className="right-1 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 border-border bg-card/95 shadow-md hover:bg-primary hover:text-primary-foreground sm:right-2 md:-right-12" />
      </Carousel>
    </div>

    <Dialog open={preview !== null} onOpenChange={(open) => !open && setPreview(null)}>
      <DialogContent className="z-[100] max-w-[90vw] border-none bg-transparent p-0 text-center md:max-w-[60vw]">
        {preview ? (
          <>
            <DialogTitle className="sr-only">{preview.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Image of {preview.name} certification
            </DialogDescription>
            <img
              src={preview.image}
              alt={preview.name}
              className="mx-auto h-auto max-h-[80vh] w-full rounded-lg object-contain"
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
    </>
  )
}
