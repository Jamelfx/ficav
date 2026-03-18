"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Calendar, Globe, Film, Award, Users,
  Play, Share2, ExternalLink, User, MapPin
} from "lucide-react";
import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    avatar: string | null;
    bio: string | null;
  } | null;
  association?: {
    name: string;
    slug: string;
  } | null;
  cast: FilmCast[];
  crew: FilmCrew[];
}

interface AwardItem {
  name: string;
  year: number;
}

const genreColors: Record<string, string> = {
  "Drame": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Comédie": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Documentaire": "bg-green-500/20 text-green-400 border-green-500/30",
  "Action": "bg-red-500/20 text-red-400 border-red-500/30",
  "Animation": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Thriller": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export default function FilmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`/api/films/${params.slug}`);
        if (!response.ok) {
          router.push("/films");
          return;
        }
        const data = await response.json();
        setFilm(data);
      } catch (error) {
        console.error("Error fetching film:", error);
        router.push("/films");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchFilm();
    }
  }, [params.slug, router]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Durée non renseignée";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} heure${hours > 1 ? "s" : ""}`;
    return `${hours}h ${mins}min`;
  };

  const parseAwards = (awardsString: string | null): AwardItem[] => {
    if (!awardsString) return [];
    try {
      const awards = JSON.parse(awardsString);
      return Array.isArray(awards) ? awards : [];
    } catch {
      return [];
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: film?.title,
          text: film?.synopsis?.slice(0, 100) || "",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getDirectorCrew = () => {
    return film?.crew.filter(c => 
      c.role.toLowerCase().includes("réalisateur") || 
      c.role.toLowerCase().includes("directeur")
    ) || [];
  };

  const getTechnicalCrew = () => {
    return film?.crew.filter(c => 
      !c.role.toLowerCase().includes("réalisateur") && 
      !c.role.toLowerCase().includes("directeur")
    ) || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-cinema">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!film) {
    return null;
  }

  const awards = parseAwards(film.awards);
  const directorCrew = getDirectorCrew();
  const technicalCrew = getTechnicalCrew();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-cinema">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Hero Section with Poster */}
        <section className="relative min-h-[60vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {film.poster ? (
              <Image
                src={film.poster}
                alt={film.title}
                fill
                className="object-cover object-top"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-secondary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/films">
                <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au catalogue
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Poster Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden glass-card cinema-screen">
                  {film.poster ? (
                    <Image
                      src={film.poster}
                      alt={film.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                      <Film className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Trailer Play Button */}
                  {film.trailerUrl && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 group"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center glow-orange-strong group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Info Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                {/* Title and Original Title */}
                <div className="mb-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-display">
                    {film.title}
                  </h1>
                  {film.titleOriginal && film.titleOriginal !== film.title && (
                    <p className="text-xl text-muted-foreground italic">
                      {film.titleOriginal}
                    </p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {film.genre && (
                    <Badge className={`${genreColors[film.genre] || "bg-gray-500/20 text-gray-400 border-gray-500/30"} text-base px-4 py-1`}>
                      {film.genre}
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{film.year}</span>
                  </div>
                  {film.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(film.duration)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>{film.country}</span>
                  </div>
                </div>

                {/* Synopsis */}
                {film.synopsis && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-3">Synopsis</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {film.synopsis}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {film.trailerUrl && (
                    <Button
                      onClick={() => setShowTrailer(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Voir la bande-annonce
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="border-border/50"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Awards Section */}
        {awards.length > 0 && (
          <section className="py-12 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground font-display">Récompenses</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {awards.map((award, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="glass-card rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{award.name}</p>
                        <p className="text-sm text-muted-foreground">{award.year}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Director Section */}
        {(film.director || directorCrew.length > 0) && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground font-display">Réalisateur</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {film.director && (
                    <div className="glass-card rounded-xl p-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary">
                        {film.director.avatar ? (
                          <Image
                            src={film.director.avatar}
                            alt={film.director.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">{film.director.name}</p>
                        {film.director.bio && (
                          <p className="text-sm text-muted-foreground mt-1">{film.director.bio}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {directorCrew.map((crew, index) => (
                    <div key={crew.id} className="glass-card rounded-xl p-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">{crew.memberName}</p>
                        <p className="text-sm text-muted-foreground">{crew.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Cast Section */}
        {film.cast.length > 0 && (
          <section className="py-12 bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground font-display">Distribution</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {film.cast.map((cast, index) => (
                    <motion.div
                      key={cast.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="glass-card rounded-xl p-4 text-center"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary mx-auto mb-3 flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">{cast.actorName}</p>
                      {cast.characterName && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {cast.characterName}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Technical Crew Section */}
        {technicalCrew.length > 0 && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Film className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground font-display">Équipe Technique</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {technicalCrew.map((crew, index) => (
                    <motion.div
                      key={crew.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="glass-card rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">{crew.memberName}</p>
                        <p className="text-sm text-muted-foreground">{crew.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Association Info */}
        {film.association && (
          <section className="py-12 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produit par</p>
                    <p className="font-semibold text-foreground">{film.association.name}</p>
                  </div>
                </div>
                <Link href={`/associations/${film.association.slug}`}>
                  <Button variant="outline" className="border-border/50">
                    Voir l&apos;association
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      {/* Trailer Modal */}
      {showTrailer && film.trailerUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowTrailer(false)}
        >
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <span className="sr-only">Fermer</span>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={film.trailerUrl}
              title={`Bande-annonce - ${film.title}`}
              className="absolute inset-0 w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
