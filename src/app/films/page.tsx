"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Film, Filter, X, Calendar, Award
} from "lucide-react";
import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilmCast {
  id: string;
  actorName: string | null;
  characterName: string | null;
}

interface FilmCrew {
  id: string;
  role: string;
  memberName: string | null;
}

interface Film {
  id: string;
  slug: string;
  title: string;
  titleOriginal: string | null;
  poster: string | null;
  synopsis: string | null;
  duration: number | null;
  year: number;
  genre: string | null;
  country: string;
  language: string | null;
  trailerUrl: string | null;
  awards: string | null;
  director?: {
    name: string;
  } | null;
  cast: FilmCast[];
  crew: FilmCrew[];
}

const genres = [
  { value: "all", label: "Tous les genres" },
  { value: "Drame", label: "Drame" },
  { value: "Comédie", label: "Comédie" },
  { value: "Documentaire", label: "Documentaire" },
  { value: "Action", label: "Action" },
  { value: "Animation", label: "Animation" },
  { value: "Thriller", label: "Thriller" },
];

const genreColors: Record<string, string> = {
  "Drame": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Comédie": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Documentaire": "bg-green-500/20 text-green-400 border-green-500/30",
  "Action": "bg-red-500/20 text-red-400 border-red-500/30",
  "Animation": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Thriller": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique years from films
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (genreFilter !== "all") params.append("genre", genreFilter);
      if (yearFilter !== "all") params.append("year", yearFilter);

      const response = await fetch(`/api/films?${params.toString()}`);
      const data = await response.json();
      setFilms(data);

      // Extract unique years
      const years = [...new Set(data.map((f: Film) => f.year))].sort((a: number, b: number) => b - a);
      setAvailableYears(years);
    } catch (error) {
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false);
    }
  }, [search, genreFilter, yearFilter]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const getDirector = (film: Film) => {
    if (film.director?.name) return film.director.name;
    const directorCrew = film.crew.find(c => c.role.toLowerCase().includes("réalisateur"));
    return directorCrew?.memberName || null;
  };

  const getAwardsCount = (film: Film) => {
    if (!film.awards) return 0;
    try {
      const awards = JSON.parse(film.awards);
      return Array.isArray(awards) ? awards.length : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-cinema">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Film className="w-3 h-3 mr-1" />
                IMDb Ivoirien
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
                Base de Données du Cinéma Ivoirien
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez la richesse du cinéma ivoirien. Films, documentaires, courts métrages...
                Explorez notre catalogue complet.
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card rounded-2xl p-6 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par titre, réalisateur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-12 bg-secondary/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                {/* Filter Toggle (Mobile) */}
                <Button
                  variant="outline"
                  className="lg:hidden h-12 border-border/50"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>

                {/* Desktop Filters */}
                <div className="hidden lg:flex gap-4">
                  <Select value={genreFilter} onValueChange={setGenreFilter}>
                    <SelectTrigger className="w-44 h-12 bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Genre" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {genres.map((genre) => (
                        <SelectItem key={genre.value} value={genre.value}>
                          {genre.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-36 h-12 bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all">Toutes</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden overflow-hidden"
                  >
                    <div className="flex flex-col gap-4 pt-4 mt-4 border-t border-border/50">
                      <Select value={genreFilter} onValueChange={setGenreFilter}>
                        <SelectTrigger className="w-full h-12 bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          {genres.map((genre) => (
                            <SelectItem key={genre.value} value={genre.value}>
                              {genre.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="w-full h-12 bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Année" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="all">Toutes</SelectItem>
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {loading ? (
                  "Chargement..."
                ) : (
                  <>{films.length} film{films.length > 1 ? "s" : ""} trouvé{films.length > 1 ? "s" : ""}</>
                )}
              </p>

              {(genreFilter !== "all" || yearFilter !== "all" || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGenreFilter("all");
                    setYearFilter("all");
                    setSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>

            {/* Films Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : films.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Film className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucun film trouvé
                </h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {films.map((film, index) => {
                  const director = getDirector(film);
                  const awardsCount = getAwardsCount(film);

                  return (
                    <motion.div
                      key={film.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/films/${film.slug}`}>
                        <div className="group cursor-pointer">
                          {/* Poster */}
                          <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 glass-card">
                            {film.poster ? (
                              <Image
                                src={film.poster}
                                alt={film.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                                <Film className="w-12 h-12 text-muted-foreground/30" />
                              </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Duration Badge */}
                            {film.duration && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-black/60 text-white border-0 text-xs">
                                  {formatDuration(film.duration)}
                                </Badge>
                              </div>
                            )}

                            {/* Awards Badge */}
                            {awardsCount > 0 && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-primary/90 text-primary-foreground border-0 text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  {awardsCount}
                                </Badge>
                              </div>
                            )}

                            {/* Play Icon on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center glow-orange">
                                <Film className="w-6 h-6 text-primary-foreground ml-1" />
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {film.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{film.year}</span>
                              {film.genre && (
                                <>
                                  <span className="text-border">•</span>
                                  <Badge className={`text-xs ${genreColors[film.genre] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                                    {film.genre}
                                  </Badge>
                                </>
                              )}
                            </div>

                            {director && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                Par {director}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              Vous êtes réalisateur ou producteur ?
            </h2>
            <p className="text-muted-foreground mb-6">
              Inscrivez votre film dans notre base de données pour gagner en visibilité
              et rejoindre la communauté du cinéma ivoirien.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange">
              <Film className="w-4 h-4 mr-2" />
              Soumettre un film
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
