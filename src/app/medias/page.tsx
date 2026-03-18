"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, Video, Play, X, 
  ChevronLeft, ChevronRight, Filter, 
  Loader2, Camera, Film, Mic, Users
} from "lucide-react";
import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Media {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  thumbnailUrl: string | null;
  category: string;
  association: {
    name: string;
  };
}

const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  conference: { label: "Conférences", icon: <Mic className="w-4 h-4" /> },
  interview: { label: "Interviews", icon: <Camera className="w-4 h-4" /> },
  evenement: { label: "Événements", icon: <Film className="w-4 h-4" /> },
  all: { label: "Tout", icon: <ImageIcon className="w-4 h-4" /> },
};

export default function MediasPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<Media[]>([]);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const response = await fetch(`/api/media?${params.toString()}`);
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, categoryFilter]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const openLightbox = (item: Media) => {
    const photos = media.filter(m => m.type === 'photo');
    const index = photos.findIndex(m => m.id === item.id);
    if (index !== -1) {
      setLightboxImages(photos);
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => 
      prev === 0 ? lightboxImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setLightboxIndex((prev) => 
      prev === lightboxImages.length - 1 ? 0 : prev + 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  // Generate placeholder images for the gallery
  const getPlaceholderImage = (item: Media, index: number) => {
    const hue = (index * 47) % 360;
    const colors = [
      'from-primary/30 to-purple-600/30',
      'from-blue-500/30 to-primary/30',
      'from-primary/30 to-pink-500/30',
      'from-green-500/30 to-primary/30',
      'from-primary/30 to-cyan-500/30',
      'from-yellow-500/30 to-primary/30',
    ];
    return colors[index % colors.length];
  };

  const photos = media.filter(m => m.type === 'photo');
  const videos = media.filter(m => m.type === 'video');

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
                <Camera className="w-3 h-3 mr-1" />
                Galerie Multimédia
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
                Galerie Médias
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Photos et vidéos des événements, conférences et activités 
                de la FICAV et de ses associations membres.
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card rounded-2xl p-4 md:p-6 mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Type Filter */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40 h-11 bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Tout</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="photo">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span>Photos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>Vidéos</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-11 bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Toutes catégories</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="conference">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        <span>Conférences</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="interview">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span>Interviews</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="evenement">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4" />
                        <span>Événements</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {(typeFilter !== "all" || categoryFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTypeFilter("all");
                      setCategoryFilter("all");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Results Count */}
            <div className="flex items-center gap-4 mb-6 text-muted-foreground">
              <span>
                {loading ? (
                  "Chargement..."
                ) : (
                  <>{media.length} élément{media.length > 1 ? "s" : ""}</>
                )}
              </span>
              {photos.length > 0 && (
                <Badge variant="outline" className="border-border/50">
                  <Camera className="w-3 h-3 mr-1" />
                  {photos.length} photo{photos.length > 1 ? "s" : ""}
                </Badge>
              )}
              {videos.length > 0 && (
                <Badge variant="outline" className="border-border/50">
                  <Video className="w-3 h-3 mr-1" />
                  {videos.length} vidéo{videos.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {/* Media Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : media.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Camera className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucun média trouvé
                </h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {/* Photos Section */}
                {(typeFilter === "all" || typeFilter === "photo") && photos.length > 0 && (
                  <div>
                    {typeFilter === "all" && (
                      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-primary" />
                        Photos
                      </h2>
                    )}
                    {/* Masonry Grid */}
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                      {photos.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="break-inside-avoid"
                        >
                          <div
                            className="group relative overflow-hidden rounded-xl cursor-pointer"
                            onClick={() => openLightbox(item)}
                          >
                            {/* Placeholder Image */}
                            <div className={`aspect-[4/3] bg-gradient-to-br ${getPlaceholderImage(item, index)} relative`}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Camera className="w-12 h-12 text-white/30" />
                              </div>
                              
                              {/* Category Badge */}
                              {item.category && (
                                <div className="absolute top-3 left-3">
                                  <Badge className="bg-black/50 text-white border-0 text-xs">
                                    {categoryLabels[item.category]?.label || item.category}
                                  </Badge>
                                </div>
                              )}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-medium mb-1 line-clamp-2">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-white/70 text-sm line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                {item.association && (
                                  <p className="text-primary text-xs mt-2">
                                    {item.association.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos Section */}
                {(typeFilter === "all" || typeFilter === "video") && videos.length > 0 && (
                  <div>
                    {typeFilter === "all" && (
                      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Vidéos
                      </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {videos.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                          >
                            <div className="relative overflow-hidden rounded-xl">
                              {/* Video Thumbnail */}
                              <div className={`aspect-video bg-gradient-to-br ${getPlaceholderImage(item, index)} relative`}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <Play className="w-8 h-8 text-white ml-1" />
                                  </div>
                                </div>
                                
                                {/* Category Badge */}
                                {item.category && (
                                  <div className="absolute top-3 left-3">
                                    <Badge className="bg-black/50 text-white border-0 text-xs">
                                      {categoryLabels[item.category]?.label || item.category}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="p-4 glass-card-light rounded-b-xl">
                                <h3 className="text-foreground font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-muted-foreground text-sm line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                {item.association && (
                                  <p className="text-primary text-xs mt-2">
                                    {item.association.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full glass text-white/80 hover:text-white hover:scale-110 transition-all z-10"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 sm:left-6 p-3 rounded-full glass text-white/80 hover:text-white hover:scale-110 transition-all z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 sm:right-6 p-3 rounded-full glass text-white/80 hover:text-white hover:scale-110 transition-all z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-full max-w-4xl aspect-video bg-gradient-to-br ${getPlaceholderImage(lightboxImages[lightboxIndex], lightboxIndex)} rounded-lg flex items-center justify-center`}>
                <Camera className="w-24 h-24 text-white/30" />
              </div>
            </motion.div>

            {/* Caption */}
            {lightboxImages[lightboxIndex] && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-xl px-6 py-3 text-center max-w-md"
              >
                <h3 className="font-medium text-white mb-1">
                  {lightboxImages[lightboxIndex].title}
                </h3>
                {lightboxImages[lightboxIndex].description && (
                  <p className="text-sm text-white/70">
                    {lightboxImages[lightboxIndex].description}
                  </p>
                )}
              </motion.div>
            )}

            {/* Image Counter */}
            {lightboxImages.length > 1 && (
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 glass rounded-lg px-3 py-1.5">
                <span className="text-sm text-white/80 font-mono tabular-nums">
                  {lightboxIndex + 1} / {lightboxImages.length}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
