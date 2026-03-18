"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Calendar, MapPin, Users, Share2,
  ExternalLink, Play, Building, Mail, Phone, Globe
} from "lucide-react";
import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: string;
  venue: string | null;
  address: string | null;
  city: string | null;
  startDate: string;
  endDate: string | null;
  image: string | null;
  videoUrl: string | null;
  maxAttendees: number | null;
  association: {
    name: string;
    slug: string;
    logo: string | null;
  } | null;
}

const eventTypeConfig: Record<string, { label: string; color: string }> = {
  FESTIVAL: { label: "Festival", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  ASSEMBLY: { label: "Assemblée", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  TRAINING: { label: "Formation", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  PROJECTION: { label: "Projection", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  CONFERENCE: { label: "Conférence", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  WORKSHOP: { label: "Atelier", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.slug}`);
        if (!response.ok) {
          router.push("/agenda");
          return;
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        router.push("/agenda");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStatus = (startDate: string, endDate: string | null) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    if (end < now) {
      return { label: "Terminé", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", isPast: true };
    }
    if (start <= now && end >= now) {
      return { label: "En cours", color: "bg-green-500/20 text-green-400 border-green-500/30", isPast: false };
    }
    
    const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return { label: "Aujourd'hui", color: "bg-primary/20 text-primary border-primary/30", isPast: false };
    }
    if (diffDays === 1) {
      return { label: "Demain", color: "bg-primary/20 text-primary border-primary/30", isPast: false };
    }
    return { label: `Dans ${diffDays} jours`, color: "bg-blue-500/20 text-blue-400 border-blue-500/30", isPast: false };
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description?.slice(0, 100) || "",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDescription = (description: string | null) => {
    if (!description) return null;
    
    // Convert markdown-like formatting to HTML-like structure
    return description
      .split("\n")
      .map((line, index) => {
        // Headers
        if (line.startsWith("## ")) {
          return (
            <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-2">
              {line.replace("## ", "")}
            </h3>
          );
        }
        // Bold items
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={index} className="font-semibold text-foreground mt-4 mb-2">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }
        // List items
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="text-muted-foreground ml-4 list-disc">
              {line.replace("- ", "")}
            </li>
          );
        }
        // Numbered items
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={index} className="text-muted-foreground ml-4 list-decimal">
              {line.replace(/^\d+\.\s/, "")}
            </li>
          );
        }
        // Empty lines
        if (line.trim() === "") {
          return <div key={index} className="h-2" />;
        }
        // Bold inline text
        const boldLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <p key={index} className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: boldLine }} />
        );
      });
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

  if (!event) {
    return null;
  }

  const typeConfig = eventTypeConfig[event.type] || { label: event.type, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
  const eventStatus = getEventStatus(event.startDate, event.endDate);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-cinema">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Hero Section with Banner */}
        <section className="relative min-h-[50vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-secondary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/agenda">
                <Button variant="ghost" className="mb-8 text-white/80 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l&apos;agenda
                </Button>
              </Link>
            </motion.div>

            <div className="max-w-3xl">
              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap gap-2 mb-4"
              >
                <Badge className={typeConfig.color}>
                  {typeConfig.label}
                </Badge>
                <Badge className={eventStatus.color}>
                  {eventStatus.label}
                </Badge>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display"
              >
                {event.title}
              </motion.h1>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-6 text-muted-foreground"
              >
                {/* Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      {formatDate(event.startDate)}
                    </p>
                    {!event.endDate && (
                      <p className="text-sm">à {formatTime(event.startDate)}</p>
                    )}
                  </div>
                </div>

                {/* End Date */}
                {event.endDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">
                        Jusqu&apos;au {formatDate(event.endDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {event.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{event.venue}</p>
                      {event.city && (
                        <p className="text-sm">{event.city}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.maxAttendees && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Jusqu&apos;à {event.maxAttendees} participants</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                {/* Video */}
                {event.videoUrl && (
                  <div className="mb-8">
                    <button
                      onClick={() => setShowVideo(true)}
                      className="relative w-full aspect-video rounded-xl overflow-hidden glass-card group"
                    >
                      {event.image && (
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center glow-orange group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <div className="glass-card rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">À propos de l&apos;événement</h2>
                    <div className="prose prose-invert max-w-none">
                      {formatDescription(event.description)}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Actions Card */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-orange"
                      disabled={eventStatus.isPast}
                    >
                      {eventStatus.isPast ? "Événement terminé" : "S&apos;inscrire"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="w-full border-border/50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>

                {/* Location Card */}
                {(event.venue || event.address || event.city) && (
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Lieu</h3>
                    <div className="space-y-3">
                      {event.venue && (
                        <div className="flex items-start gap-3">
                          <Building className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">{event.venue}</p>
                            {event.address && (
                              <p className="text-sm text-muted-foreground">{event.address}</p>
                            )}
                            {event.city && (
                              <p className="text-sm text-muted-foreground">{event.city}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Organizer Card */}
                {event.association && (
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Organisateur</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        {event.association.logo ? (
                          <Image
                            src={event.association.logo}
                            alt={event.association.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{event.association.name}</p>
                        <Link
                          href={`/associations/${event.association.slug}`}
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Voir le profil
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Details Card */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Date et heure</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">
                          {formatDate(event.startDate)}
                        </p>
                        {!event.endDate && (
                          <p className="text-sm text-muted-foreground">
                            à {formatTime(event.startDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    {event.endDate && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">
                            Jusqu&apos;au {formatDate(event.endDate)}
                          </p>
                        </div>
                      </div>
                    )}
                    {event.maxAttendees && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">
                            {event.maxAttendees} places
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Capacité maximale
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Video Modal */}
      {showVideo && event.videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowVideo(false)}
        >
          <button
            onClick={() => setShowVideo(false)}
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
              src={event.videoUrl}
              title={`Vidéo - ${event.title}`}
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
