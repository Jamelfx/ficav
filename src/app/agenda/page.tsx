"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Calendar, Filter, X, MapPin, Users, Clock,
  ChevronRight, Star, Briefcase, Plus, Loader2, CheckCircle
} from "lucide-react";
import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
  maxAttendees: number | null;
  association: {
    name: string;
    slug: string;
  } | null;
}

const eventTypes = [
  { value: "all", label: "Tous les événements" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "ASSEMBLY", label: "Assemblée" },
  { value: "TRAINING", label: "Formation" },
  { value: "PROJECTION", label: "Projection" },
  { value: "CONFERENCE", label: "Conférence" },
  { value: "WORKSHOP", label: "Atelier" },
];

const eventTypeConfig: Record<string, { label: string; color: string; icon: typeof Calendar }> = {
  FESTIVAL: { label: "Festival", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Star },
  ASSEMBLY: { label: "Assemblée", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Users },
  TRAINING: { label: "Formation", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: Calendar },
  PROJECTION: { label: "Projection", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: Calendar },
  CONFERENCE: { label: "Conférence", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: Calendar },
  WORKSHOP: { label: "Atelier", color: "bg-pink-500/20 text-pink-400 border-pink-500/30", icon: Calendar },
};

const jobTypes = [
  { value: "EMPLOI", label: "Offre d'emploi" },
  { value: "CASTING", label: "Casting" },
  { value: "APPEL_PROJET", label: "Appel à projets" },
  { value: "STAGE", label: "Stage" },
  { value: "FORMATION", label: "Formation" },
];

export default function AgendaPage() {
  const { user, isAuthenticated, isHydrated } = useAuth();
  const isAssociationAdmin = user?.role === "ADMIN_ASSOCIATION";
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showFilters, setShowFilters] = useState(false);
  
  // Job offer form state
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    type: "EMPLOI",
    location: "",
    isRemote: false,
    salary: "",
    deadline: "",
    requirements: "",
    contactEmail: user?.email || "",
    contactPhone: "",
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      params.append("past", activeTab === "past" ? "true" : "false");

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();
      
      // Filter by search if provided
      let filtered = data;
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = data.filter((event: Event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.venue?.toLowerCase().includes(searchLower) ||
          event.city?.toLowerCase().includes(searchLower)
        );
      }
      
      setEvents(filtered);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, activeTab, search]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Update contact email when user changes
  useEffect(() => {
    if (user?.email) {
      setJobForm(prev => ({ ...prev, contactEmail: user.email || prev.contactEmail }));
    }
  }, [user?.email]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
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

  const formatEventDate = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    
    if (!endDate) {
      return `${formatDate(startDate)} à ${formatTime(startDate)}`;
    }
    
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return `${formatDate(startDate)}`;
    }
    
    return `Du ${formatDate(startDate)} au ${formatDate(endDate)}`;
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return { text: "Passé", isPast: true };
    if (diff === 0) return { text: "Aujourd'hui", isPast: false };
    if (diff === 1) return { text: "Demain", isPast: false };
    return { text: `Dans ${diff} jours`, isPast: false };
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.associationId) {
      toast.error("Erreur", {
        description: "Vous devez être connecté en tant qu'administrateur d'association pour publier une offre.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requirementsArray = jobForm.requirements
        .split("\n")
        .map(r => r.trim())
        .filter(r => r.length > 0);

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobForm.title,
          description: jobForm.description,
          type: jobForm.type,
          location: jobForm.location,
          isRemote: jobForm.isRemote,
          salary: jobForm.salary,
          deadline: jobForm.deadline || null,
          requirements: requirementsArray,
          contactEmail: jobForm.contactEmail,
          contactPhone: jobForm.contactPhone,
          associationId: user.associationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'offre");
      }

      toast.success("Offre soumise avec succès", {
        description: "Votre offre a été envoyée au Directeur de la Communication pour validation. Vous serez notifié une fois qu'elle sera publiée.",
      });

      // Reset form
      setJobForm({
        title: "",
        description: "",
        type: "EMPLOI",
        location: "",
        isRemote: false,
        salary: "",
        deadline: "",
        requirements: "",
        contactEmail: user?.email || "",
        contactPhone: "",
      });
      setShowJobDialog(false);
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la soumission de votre offre.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render until hydrated to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-cinema">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

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
                <Calendar className="w-3 h-3 mr-1" />
                Agenda Culturel
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
                Agenda du Cinéma Ivoirien
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Festivals, projections, formations, ateliers... Tous les événements 
                du cinéma et de l&apos;audiovisuel ivoirien en un seul lieu.
              </p>
            </motion.div>

            {/* Tabs and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card rounded-2xl p-6 mb-8"
            >
              <div className="flex flex-col gap-6">
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-secondary/50 border border-border/50">
                    <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Événements à venir
                    </TabsTrigger>
                    <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Archives
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un événement..."
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
                  <div className="hidden lg:block">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-56 h-12 bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Type d'événement" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                      <div className="pt-4 border-t border-border/50">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger className="w-full h-12 bg-secondary/50 border-border/50">
                            <SelectValue placeholder="Type d'événement" />
                          </SelectTrigger>
                          <SelectContent className="glass-card">
                            {eventTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {loading ? (
                  "Chargement..."
                ) : (
                  <>{events.length} événement{events.length > 1 ? "s" : ""} trouvé{events.length > 1 ? "s" : ""}</>
                )}
              </p>

              {(typeFilter !== "all" || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTypeFilter("all");
                    setSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>

            {/* Events List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucun événement trouvé
                </h3>
                <p className="text-muted-foreground">
                  {activeTab === "upcoming" 
                    ? "Aucun événement à venir pour ces critères."
                    : "Aucun événement passé trouvé."}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {events.map((event, index) => {
                  const typeConfig = eventTypeConfig[event.type] || { 
                    label: event.type, 
                    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
                    icon: Calendar 
                  };
                  const daysUntil = getDaysUntil(event.startDate);
                  const IconComponent = typeConfig.icon;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link href={`/agenda/${event.slug}`}>
                        <div className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Image */}
                            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                              {event.image ? (
                                <Image
                                  src={event.image}
                                  alt={event.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                                  <IconComponent className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <Badge className={typeConfig.color}>
                                    {typeConfig.label}
                                  </Badge>
                                  {activeTab === "upcoming" && !daysUntil.isPast && (
                                    <Badge variant="outline" className="ml-2 border-primary/30 text-primary">
                                      {daysUntil.text}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {event.title}
                              </h3>

                              {/* Date and Location */}
                              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatEventDate(event.startDate, event.endDate)}</span>
                                </div>
                                {event.venue && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.venue}</span>
                                  </div>
                                )}
                                {event.city && (
                                  <div className="flex items-center gap-1 text-muted-foreground/70">
                                    <span>•</span>
                                    <span>{event.city}</span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              {event.description && (
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                  {event.description.replace(/\*\*/g, "").replace(/##/g, "").replace(/\n/g, " ")}
                                </p>
                              )}

                              {/* Footer */}
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {event.maxAttendees && (
                                    <>
                                      <Users className="w-4 h-4" />
                                      <span>Jusqu&apos;à {event.maxAttendees} participants</span>
                                    </>
                                  )}
                                  {event.association && (
                                    <span className="text-muted-foreground/70">
                                      • {event.association.name}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
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

        {/* CTA Section - Only for Association Admins */}
        {isAuthenticated && isAssociationAdmin && (
          <section className="py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
                  Vous souhaitez publier une offre ?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Les administrateurs d&apos;associations membres peuvent publier des offres d&apos;emploi, 
                  castings et appels à projets. Votre offre sera validée par le Directeur de la Communication 
                  avant publication.
                </p>
                <Button 
                  onClick={() => setShowJobDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Publier une offre
                </Button>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      {/* Job Offer Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-wider">
              Publier une offre
            </DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous. Votre offre sera soumise à validation avant publication.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleJobSubmit} className="space-y-6 mt-4">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="job-type">Type d&apos;offre *</Label>
              <Select
                value={jobForm.type}
                onValueChange={(value) => setJobForm({ ...jobForm, type: value })}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="job-title">Titre de l&apos;offre *</Label>
              <Input
                id="job-title"
                placeholder="Ex: Assistant à la réalisation, Casting acteur..."
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                className="bg-background/50"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="job-description">Description *</Label>
              <Textarea
                id="job-description"
                placeholder="Décrivez l'offre en détail..."
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                className="bg-background/50 min-h-[120px]"
                required
              />
            </div>

            {/* Location & Remote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-location">Lieu</Label>
                <Input
                  id="job-location"
                  placeholder="Ex: Abidjan, Plateau"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-salary">Rémunération</Label>
                <Input
                  id="job-salary"
                  placeholder="Ex: 500 000 FCFA/mois"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Remote checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="job-remote"
                checked={jobForm.isRemote}
                onChange={(e) => setJobForm({ ...jobForm, isRemote: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="job-remote" className="font-normal">
                Travail à distance possible
              </Label>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="job-deadline">Date limite</Label>
              <Input
                id="job-deadline"
                type="date"
                value={jobForm.deadline}
                onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                className="bg-background/50"
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="job-requirements">Exigences / Qualifications</Label>
              <Textarea
                id="job-requirements"
                placeholder="Une exigence par ligne..."
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                className="bg-background/50 min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Entrez chaque exigence sur une nouvelle ligne
              </p>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-email">Email de contact *</Label>
                <Input
                  id="job-email"
                  type="email"
                  placeholder="contact@association.ci"
                  value={jobForm.contactEmail}
                  onChange={(e) => setJobForm({ ...jobForm, contactEmail: e.target.value })}
                  className="bg-background/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-phone">Téléphone</Label>
                <Input
                  id="job-phone"
                  placeholder="+225 07 XX XX XX XX"
                  value={jobForm.contactPhone}
                  onChange={(e) => setJobForm({ ...jobForm, contactPhone: e.target.value })}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Association info */}
            {user?.associationName && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  Cette offre sera publiée au nom de <strong className="text-foreground">{user.associationName}</strong>
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJobDialog(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Soumettre l&apos;offre
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
