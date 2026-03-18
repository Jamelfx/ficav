"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  Clock,
  MapPin,
  Users,
  CalendarDays,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";

// Mock events data - Ces événements sont créés par la Fédération
const eventsData = [
  {
    id: "1",
    title: "Workshop Acting for Camera",
    description: "Formation pratique sur les techniques de jeu face à la caméra avec des professionnels du cinéma.",
    type: "FORMATION",
    venue: "Studio FICAV",
    address: "Plateau, Abidjan",
    city: "Abidjan",
    startDate: "2025-01-15",
    endDate: "2025-01-15",
    startTime: "14:00",
    endTime: "18:00",
    status: "upcoming",
    maxAttendees: 60,
    currentAttendees: 45,
    isOnline: false,
  },
  {
    id: "2",
    title: "Assemblée Générale Ordinaire",
    description: "Réunion annuelle de l'association pour le bilan et les perspectives.",
    type: "REUNION",
    venue: "Salle de conférence FICAV",
    address: "Plateau, Abidjan",
    city: "Abidjan",
    startDate: "2025-01-20",
    endDate: "2025-01-20",
    startTime: "09:00",
    endTime: "12:00",
    status: "upcoming",
    maxAttendees: 150,
    currentAttendees: 89,
    isOnline: false,
  },
  {
    id: "3",
    title: "Masterclass Réalisation",
    description: "Masterclass avec un réalisateur primé sur les techniques de mise en scène.",
    type: "FORMATION",
    venue: "Institut Français",
    address: "Cocody, Abidjan",
    city: "Abidjan",
    startDate: "2025-01-28",
    endDate: "2025-01-28",
    startTime: "10:00",
    endTime: "16:00",
    status: "upcoming",
    maxAttendees: 40,
    currentAttendees: 32,
    isOnline: false,
  },
  {
    id: "4",
    title: "Webinar : Financement du cinéma",
    description: "Session en ligne sur les opportunités de financement pour les projets cinématographiques.",
    type: "WEBINAR",
    venue: "En ligne",
    address: "",
    city: "",
    startDate: "2025-02-05",
    endDate: "2025-02-05",
    startTime: "15:00",
    endTime: "17:00",
    status: "upcoming",
    maxAttendees: 100,
    currentAttendees: 67,
    isOnline: true,
  },
  {
    id: "5",
    title: "Soirée de remise des prix",
    description: "Célébration des meilleurs talents de l'année écoulée.",
    type: "EVENEMENT",
    venue: "Hôtel Ivoire",
    address: "Plateau, Abidjan",
    city: "Abidjan",
    startDate: "2025-02-14",
    endDate: "2025-02-14",
    startTime: "19:00",
    endTime: "23:00",
    status: "upcoming",
    maxAttendees: 200,
    currentAttendees: 0,
    isOnline: false,
  },
  {
    id: "6",
    title: "Atelier Scénario",
    description: "Atelier pratique d'écriture de scénario avec un scénariste professionnel.",
    type: "FORMATION",
    venue: "Maison de la Culture",
    address: "Treichville, Abidjan",
    city: "Abidjan",
    startDate: "2024-12-10",
    endDate: "2024-12-12",
    startTime: "09:00",
    endTime: "17:00",
    status: "past",
    maxAttendees: 25,
    currentAttendees: 25,
    isOnline: false,
  },
];

const typeConfig: Record<string, { label: string; color: string }> = {
  FORMATION: { label: "Formation", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  REUNION: { label: "Réunion", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  WEBINAR: { label: "Webinaire", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  EVENEMENT: { label: "Événement", color: "bg-primary/10 text-primary border-primary/20" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  upcoming: { label: "À venir", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  draft: { label: "Brouillon", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  past: { label: "Passé", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
};

export default function EvenementsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: eventsData.length,
    upcoming: eventsData.filter((e) => e.status === "upcoming").length,
    past: eventsData.filter((e) => e.status === "past").length,
    totalAttendees: eventsData.reduce((acc, e) => acc + e.currentAttendees, 0),
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="glass-card border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Les événements sont organisés par la <span className="text-primary font-semibold">Fédération FICAV</span>. 
              En tant que membre d&apos;association, vous pouvez consulter les événements et vous y inscrire.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total événements", value: stats.total, icon: Calendar, color: "text-primary" },
          { label: "À venir", value: stats.upcoming, icon: CalendarDays, color: "text-green-400" },
          { label: "Passés", value: stats.past, icon: Calendar, color: "text-gray-400" },
          { label: "Participants", value: stats.totalAttendees, icon: Users, color: "text-blue-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-display text-3xl text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="font-display text-xl tracking-wider">
              Événements de la Fédération
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="FORMATION">Formation</SelectItem>
                <SelectItem value="REUNION">Réunion</SelectItem>
                <SelectItem value="WEBINAR">Webinaire</SelectItem>
                <SelectItem value="EVENEMENT">Événement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="past">Passés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map((event, index) => {
              const type = typeConfig[event.type];
              const status = statusConfig[event.status];
              const fillPercentage = Math.round((event.currentAttendees / event.maxAttendees) * 100);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-border/30 hover:glow-orange transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Date Badge */}
                        <div className="flex items-center gap-4 md:w-32 shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                            <span className="font-display text-xl text-primary">
                              {new Date(event.startDate).getDate()}
                            </span>
                            <span className="text-xs text-muted-foreground uppercase">
                              {new Date(event.startDate).toLocaleDateString("fr-FR", { month: "short" })}
                            </span>
                          </div>
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display text-lg tracking-wider text-foreground">
                                {event.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {event.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="outline" className={type.color}>
                                {type.label}
                              </Badge>
                              <Badge variant="outline" className={status.color}>
                                {status.label}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.startTime} - {event.endTime}
                            </span>
                            <span className="flex items-center gap-1">
                              {event.isOnline ? (
                                <>
                                  <Video className="w-4 h-4" />
                                  En ligne
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-4 h-4" />
                                  {event.venue}
                                </>
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.currentAttendees} / {event.maxAttendees}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          {event.status !== "past" && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Participants</span>
                                <span>{fillPercentage}%</span>
                              </div>
                              <Progress value={fillPercentage} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Aucun événement trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
