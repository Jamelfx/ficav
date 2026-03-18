"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  isFeatured?: boolean;
  publishedAt: string;
}

// Default news for SSR
const defaultNews: NewsItem[] = [
  {
    id: "1",
    slug: "fespaco-2024",
    title: "FESPACO 2024: Le cinéma ivoirien en force",
    excerpt: "La délégation ivoirienne revient du FESPACO avec 5 prix prestigieux, confirmant la vitalité de notre cinéma.",
    isFeatured: true,
    publishedAt: "2024-03-10",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    slug: "nouveau-financement",
    title: "Nouveau fonds de financement pour le cinéma",
    excerpt: "Le gouvernement ivoirien annonce un fonds de 2 milliards FCFA pour soutenir la production.",
    publishedAt: "2024-04-15",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    slug: "formation-netflix",
    title: "Partenariat FICAV-Netflix pour la formation",
    excerpt: "Netflix s'engage à former 100 techniciens ivoiriens d'ici 2025.",
    publishedAt: "2024-05-01",
    image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    slug: "festival-clap-2024",
    title: "Le Festival Clap d'Abidjan fête ses 10 ans",
    excerpt: "Une édition anniversaire riche en surprises et en avant-premières.",
    publishedAt: "2024-06-20",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=300&fit=crop",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>(defaultNews);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setNews(data);
        }
      })
      .catch(console.error);
  }, []);

  const featuredNews = news.find((item) => item.isFeatured);
  const recentNews = news.filter((item) => !item.isFeatured).slice(0, 4);

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Actualités
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Restez informé des dernières nouvelles du cinéma ivoirien
          </p>
        </motion.div>

        {featuredNews && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured Article */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="lg:row-span-2"
            >
              <article className="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:glow-orange transition-shadow duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${featuredNews.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    À la une
                  </Badge>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(featuredNews.publishedAt)}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featuredNews.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 flex-1">
                    {featuredNews.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    Lire l&apos;article
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </motion.div>

            {/* Recent News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/actualites/${item.slug}`} className="block group h-full">
                    <article className="glass-card-light rounded-xl overflow-hidden h-full flex flex-col hover:bg-white/10 transition-colors">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Toutes les actualités
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
