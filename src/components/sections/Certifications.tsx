import { FaAward, FaBuilding, FaCalendarAlt, FaExternalLinkAlt, FaTerminal } from "react-icons/fa";

import { Card, CardContent } from "../ui/card";
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
    DialogTrigger
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

export default function Certifications({ items, verifyText }: CertificationsProps) {
  return (
    <div className="relative mx-auto w-full max-w-5xl px-0 sm:px-2">
      <Carousel
        className="w-full"
      >
        <CarouselContent>
          {items.map((cert, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="card-premium min-h-0 overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 md:min-h-[420px] lg:min-h-[480px]">
                  <CardContent className="p-0 h-full">
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Left: Image (wrapped in Dialog) */}
                      <Dialog>
                        <div className="relative flex h-52 w-full cursor-pointer items-center justify-center overflow-hidden bg-neutral-950 group sm:h-64 md:h-full md:w-2/5">
                          <DialogTrigger asChild>
                            <div className="w-full h-full relative">
                              <img
                                src={cert.image}
                                alt={cert.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading={index === 0 ? "eager" : "lazy"}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-2 py-1 rounded">
                                  View
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background-dark/50 md:hidden" />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] md:max-w-[60vw] p-0 bg-transparent border-none overflow-hidden text-center">
                            <DialogTitle className="sr-only">{cert.name}</DialogTitle>
                            <DialogDescription className="sr-only">Image of {cert.name} certification</DialogDescription>
                            <img 
                              src={cert.image} 
                              alt={cert.name} 
                              className="w-full h-auto max-h-[80vh] object-contain mx-auto rounded-lg"
                            />
                          </DialogContent>
                        </div>
                      </Dialog>

                      {/* Right: Info */}
                      <div className="flex h-full w-full flex-col justify-center overflow-y-auto p-5 custom-scrollbar sm:p-6 md:w-3/5 md:p-8">
                        <div className="mb-2">
                          <h3 className="font-display mb-2 line-clamp-2 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                            {cert.name}
                          </h3>
                          <div className="flex items-center text-muted-foreground mb-1">
                             <FaBuilding className="w-4 h-4 mr-2 text-primary" />
                             <span className="text-sm font-medium">{cert.issuer}</span>
                          </div>
                           <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center">
                                <FaCalendarAlt className="w-3.5 h-3.5 mr-1.5" />
                                {cert.date}
                              </div>
                              {cert.credentialId && (
                                <div className="flex items-center">
                                  <FaAward className="w-3.5 h-3.5 mr-1.5" />
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
                          {cert.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center"
                            >
                              <FaTerminal className="w-3 h-3 mr-1.5" />
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
                              <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                              {verifyText}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 top-[42%] flex min-h-11 min-w-11 -translate-y-1/2 border-border bg-card/95 shadow-md hover:bg-primary hover:text-primary-foreground sm:left-2 md:-left-12 md:top-1/2" />
        <CarouselNext className="right-1 top-[42%] flex min-h-11 min-w-11 -translate-y-1/2 border-border bg-card/95 shadow-md hover:bg-primary hover:text-primary-foreground sm:right-2 md:-right-12 md:top-1/2" />
      </Carousel>
    </div>
  )
}
