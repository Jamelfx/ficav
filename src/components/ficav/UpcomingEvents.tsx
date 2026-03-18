"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  slug: string;
  title: string;
  description?: string;
  type: string;
  venue?: string;
  city?: string;
  startDate: string;
  endDate?: string;
  image?: string;
}

const eventTypeColors: Record<string, string> = {
  FESTIVAL: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ASSEMBLY: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  TRAINING: "bg-green-500/20 text-green-400 border-green-500/30",
  PROJECTION: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CONFERENCE: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  WORKSHOP: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const eventTypeLabels: Record<string, string> = {
  FESTIVAL: "Festival",
  ASSEMBLY: "Assemblée",
  TRAINING: "Formation",
  PROJECTION: "Projection",
  CONFERENCE: "Conférence",
  WORKSHOP: "Atelier",
};

// Default events for SSR
const defaultEvents: Event[] = [
  {
    id: "1",
    slug: "ficav-2024",
    title: "Festival du Cinéma Ivoirien 2024",
    type: "FESTIVAL",
    venue: "Palais de la Culture",
    city: "Abidjan",
    startDate: "2024-11-15T10:00:00",
  },
  {
    id: "2",
    slug: "formation-scenario",
    title: "Formation Écriture de Scénario",
    type: "TRAINING",
    venue: "Institut National des Arts",
    city: "Abidjan",
    startDate: "2024-09-10T09:00:00",
  },
  {
    id: "3",
    slug: "projection-run",
    title: "Avant-première 'Run'",
    type: "PROJECTION",
    venue: "CanalOlympia",
    city: "Bingerville",
    startDate: "2024-06-10T19:00:00",
  },
  {
    id: "4",
    slug: "conference-industrie",
    title: "Conférence Industrie du Cinéma",
    type: "CONFERENCE",
    venue: "Sofitel Abidjan",
    city: "Abidjan",
    startDate: "2024-10-05T14:00:00",
  },
];

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setEvents(data);
        }
      })
      .catch(console.error);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Événements à venir
            </h2>
            <p className="text-muted-foreground">
              Ne manquez aucun événement de l&apos;écosystème cinématographique
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/agenda/${event.slug}`} className="block group">
                <article className="glass-card rounded-xl overflow-hidden hover:glow-orange transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row">
                    {/* Date Card */}
                    <div className="flex-shrink-0 p-4 sm:p-6 flex sm:flex-col items-center sm:items-center justify-center bg-primary/5 sm:w-28">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">
                          {formatDate(event.startDate).split(" ")[0]}
                        </div>
                        <div className="text-sm text-muted-foreground uppercase">
                          {formatDate(event.startDate).split(" ")[1]}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge 
                          variant="outline"
                          className={eventTypeColors[event.type] || ""}
                        >
                          {eventTypeLabels[event.type] || event.type}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTime(event.startDate)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {event.description}
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>
                          {[event.venue, event.city].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Voir tous les événements
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
