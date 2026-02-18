import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

interface Project {
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tags: string[];
}

interface ProjectGalleryProps {
  projects: Project[];
  labels: {
    viewAll: string;
    filterAll: string;
    showMore: string;
    showLess: string;
  };
}

export default function ProjectGallery({ projects, labels }: ProjectGalleryProps) {
  const [filter, setFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const allTags = useMemo(() => {
    const capsTags = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => capsTags.add(t)));
    return Array.from(capsTags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter(p => p.tags.includes(filter));
  }, [projects, filter]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={filter === 'All' ? "default" : "outline"}
          onClick={() => { setFilter('All'); setVisibleCount(6); }}
          className="rounded-full"
        >
          {labels.filterAll}
        </Button>
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={filter === tag ? "default" : "outline"}
            onClick={() => { setFilter(tag); setVisibleCount(6); }}
            className="rounded-full"
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div 
        layout
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {displayedProjects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={project.title}
            >
              <Card className="h-full flex flex-col glass-panel overflow-hidden border-transparent hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.github && (
                      <a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 rounded-full hover:bg-primary hover:text-white transition-colors backdrop-blur-sm"
                        aria-label="View Code"
                      >
                        <FaGithub className="text-xl" />
                      </a>
                    )}
                    {project.link && (
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 rounded-full hover:bg-primary hover:text-white transition-colors backdrop-blur-sm"
                        aria-label="View Project"
                      >
                        <FaExternalLinkAlt className="text-xl" />
                      </a>
                    )}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-wrap gap-2 pt-0">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-transparent">
                      {tag}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Show More/Less Button */}
      {(hasMore || (visibleCount > 6 && filteredProjects.length > 6)) && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={hasMore ? handleShowMore : handleShowLess}
            className="group gap-2 rounded-full px-8 border-primary/20 hover:border-primary text-primary hover:bg-primary/5"
          >
            {hasMore ? labels.showMore : labels.showLess}
            <span className={`transition-transform duration-300 ${hasMore ? 'rotate-0' : 'rotate-180'}`}>
              ▼
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
