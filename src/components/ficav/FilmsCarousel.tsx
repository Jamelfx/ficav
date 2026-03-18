"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Film {
  id: string;
  slug: string;
  title: string;
  titleOriginal?: string;
  poster?: string;
  synopsis?: string;
  duration?: number;
  year: number;
  genre?: string;
  country?: string;
}

// Placeholder images for films
const placeholderImages = [
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
];

// Default films for SSR
const defaultFilms: Film[] = [
  { id: "1", slug: "run-2023", title: "Run", year: 2023, genre: "Drame", poster: placeholderImages[0] },
  { id: "2", slug: "les-birds-2022", title: "Les Birds", year: 2022, genre: "Comédie", poster: placeholderImages[1] },
  { id: "3", slug: "adama-2021", title: "Adama", year: 2021, genre: "Animation", poster: placeholderImages[2] },
  { id: "4", slug: "bangui-2020", title: "Bangui", year: 2020, genre: "Documentaire", poster: placeholderImages[3] },
  { id: "5", slug: "le-reveil-2024", title: "Le Réveil", year: 2024, genre: "Thriller", poster: placeholderImages[4] },
];

export function FilmsCarousel() {
  const [films, setFilms] = useState<Film[]>(defaultFilms);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/films")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setFilms(data);
        }
      })
      .catch(console.error);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Films du moment
            </h2>
            <p className="text-muted-foreground">
              Découvrez les dernières productions ivoiriennes
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="border-border/50 hover:bg-primary/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="border-border/50 hover:bg-primary/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Films Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6"
        >
          {films.map((film, index) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(film.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex-shrink-0 w-[200px] sm:w-[240px] group"
            >
              <Link href={`/films/${film.slug}`}>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden glass-card">
                  {/* Poster Image */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${film.poster || placeholderImages[index % placeholderImages.length]})`,
                      }}
                    />
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === film.id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: hoveredId === film.id ? 1 : 0.8 }}
                      className="w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-orange"
                    >
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </motion.div>
                  </motion.div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {film.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{film.year}</span>
                        {film.genre && (
                          <>
                            <span>•</span>
                            <span className="line-clamp-1">{film.genre}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      7.5
                    </Badge>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll indicators */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="border-border/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Glissez pour explorer
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="border-border/50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/films"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Voir tout le catalogue
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
