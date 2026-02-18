import { useMemo, useState } from 'preact/hooks';

interface Project {
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tags: string[];
}

interface Props {
  projects: Project[];
  labels: {
    filterAll: string;
    showMore: string;
    showLess: string;
  };
}

export default function ProjectGallery({ projects, labels }: Props) {
  const [activeFilter, setActiveFilter] = useState(labels?.filterAll || 'All');
  const [showAll, setShowAll] = useState(false);

  // Extract unique tags across all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return [labels?.filterAll || 'All', ...Array.from(tags).sort()];
  }, [projects, labels]);

  const filtered = useMemo(() => {
    if (activeFilter === (labels?.filterAll || 'All')) return projects;
    return projects.filter((p) => p.tags.includes(activeFilter));
  }, [projects, activeFilter, labels]);

  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <div>
      {/* Filter chips */}
      <div class="flex flex-wrap justify-center gap-2 mb-10">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => { setActiveFilter(tag); setShowAll(false); }}
            class={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeFilter === tag
                ? 'bg-primary text-white shadow-glow-sm'
                : 'glass-panel text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary/30'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((project) => (
          <div
            key={project.title}
            class="group glass-panel rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image */}
            <div class="relative h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Overlay with links */}
              <div class="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener"
                    class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    aria-label="Source code"
                  >
                    <span class="material-symbols-outlined">code</span>
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener"
                    class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    aria-label="Live demo"
                  >
                    <span class="material-symbols-outlined">visibility</span>
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              <div class="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    class="px-2 py-0.5 text-xs font-medium rounded-md bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less */}
      {filtered.length > 6 && (
        <div class="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer"
          >
            {showAll ? (labels?.showLess || 'Show Less') : `${labels?.showMore || 'Show All'} (${filtered.length})`}
            <span class="material-symbols-outlined text-lg">
              {showAll ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
