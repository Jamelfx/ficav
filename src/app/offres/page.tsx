"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Clock, Briefcase, Users, 
  ChevronRight, Filter, X, Loader2,
  Laptop, Plus, Send, Building2
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  location: string;
  isRemote: boolean;
  salary: string;
  deadline: string | null;
  requirements: string;
  contactEmail: string | null;
  contactPhone: string | null;
  isFilled: boolean;
  association: {
    name: string;
    logo: string | null;
  };
}

const jobTypeLabels: Record<string, { label: string; color: string }> = {
  EMPLOI: { label: "Emploi", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  CASTING: { label: "Casting", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  APPEL_PROJET: { label: "Appel à projets", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  STAGE: { label: "Stage", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  FORMATION: { label: "Formation", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
};

export default function OffresPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [showFilters, setShowFilters] = useState(false);
  
  // User and association state
  const [user, setUser] = useState<{id: string; name: string; email: string; role: string; associationId?: string} | null>(null);
  const [association, setAssociation] = useState<{id: string; name: string; status: string} | null>(null);
  const [isAssociationMember, setIsAssociationMember] = useState(false);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "EMPLOI",
    location: "",
    isRemote: false,
    salary: "",
    deadline: "",
    requirements: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Check if user is logged in and is an association member
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Check if user is an association admin
          if (userData.associationId) {
            const assocResponse = await fetch(`/api/associations/${userData.associationId}`);
            if (assocResponse.ok) {
              const assocData = await assocResponse.json();
              setAssociation(assocData);
              // Only ACTIVE associations with paid membership can publish
              setIsAssociationMember(assocData.status === 'ACTIVE');
            }
          } else if (userData.role === 'ADMIN_ASSOCIATION') {
            // Admin association without associationId - still allow
            setIsAssociationMember(true);
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };
    checkUser();
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (search) params.append("search", search);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.associationId && user?.role !== 'ADMIN_ASSOCIATION') {
      toast({
        title: "Erreur",
        description: "Vous devez être administrateur d'une association membre pour publier une offre.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split('\n').filter(r => r.trim()),
          associationId: user.associationId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Offre soumise",
          description: "Votre offre a été soumise et est en attente de validation par le Directeur de la Communication.",
        });
        setDialogOpen(false);
        setFormData({
          title: "",
          description: "",
          type: "EMPLOI",
          location: "",
          isRemote: false,
          salary: "",
          deadline: "",
          requirements: "",
          contactEmail: "",
          contactPhone: "",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const getDeadlineStatus = (deadline: string | null) => {
    if (!deadline) return { text: "Pas de date limite", isExpired: false };
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: "Expiré", isExpired: true };
    } else if (diffDays === 0) {
      return { text: "Dernier jour", isExpired: false };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} jour${diffDays > 1 ? "s" : ""} restant${diffDays > 1 ? "s" : ""}`, isExpired: false };
    } else {
      return { text: `${diffDays} jours restants`, isExpired: false };
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    return new Date(deadline).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
                <Briefcase className="w-3 h-3 mr-1" />
                Marketplace Professionnel
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
                Offres Professionnelles
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Emplois, castings, appels à projets et formations dans le secteur 
                cinématographique et audiovisuel ivoirien.
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
                    placeholder="Rechercher par titre..."
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
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48 h-12 bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Type d'offre" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="EMPLOI">Emploi</SelectItem>
                      <SelectItem value="CASTING">Casting</SelectItem>
                      <SelectItem value="APPEL_PROJET">Appel à projets</SelectItem>
                      <SelectItem value="STAGE">Stage</SelectItem>
                      <SelectItem value="FORMATION">Formation</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 h-12 bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="expired">Expirées</SelectItem>
                      <SelectItem value="all">Toutes</SelectItem>
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
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full h-12 bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Type d'offre" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="all">Tous les types</SelectItem>
                          <SelectItem value="EMPLOI">Emploi</SelectItem>
                          <SelectItem value="CASTING">Casting</SelectItem>
                          <SelectItem value="APPEL_PROJET">Appel à projets</SelectItem>
                          <SelectItem value="STAGE">Stage</SelectItem>
                          <SelectItem value="FORMATION">Formation</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full h-12 bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="active">Actives</SelectItem>
                          <SelectItem value="expired">Expirées</SelectItem>
                          <SelectItem value="all">Toutes</SelectItem>
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
                  <>{jobs.length} offre{jobs.length > 1 ? "s" : ""} trouvée{jobs.length > 1 ? "s" : ""}</>
                )}
              </p>
              
              {(typeFilter !== "all" || statusFilter !== "active" || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTypeFilter("all");
                    setStatusFilter("active");
                    setSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>

            {/* Jobs Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : jobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Briefcase className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucune offre trouvée
                </h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, index) => {
                  const deadlineStatus = getDeadlineStatus(job.deadline);
                  const typeInfo = jobTypeLabels[job.type] || { label: job.type, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
                  
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link href={`/offres/${job.slug}`}>
                        <div className={`glass-card rounded-xl p-6 h-full hover:border-primary/30 transition-all duration-300 group cursor-pointer ${deadlineStatus.isExpired ? "opacity-60" : ""}`}>
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <Badge className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                            {job.isFilled && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                Pourvu
                              </Badge>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>

                          {/* Location & Remote */}
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                            {job.location && (
                              <>
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </>
                            )}
                            {job.isRemote && (
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                                <Laptop className="w-3 h-3 mr-1" />
                                Remote
                              </Badge>
                            )}
                          </div>

                          {/* Salary */}
                          {job.salary && (
                            <p className="text-primary font-medium text-sm mb-4">
                              {job.salary}
                            </p>
                          )}

                          {/* Deadline */}
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className={`w-4 h-4 ${deadlineStatus.isExpired ? "text-red-400" : "text-muted-foreground"}`} />
                            <span className={deadlineStatus.isExpired ? "text-red-400" : "text-muted-foreground"}>
                              {deadlineStatus.text}
                            </span>
                            {job.deadline && !deadlineStatus.isExpired && (
                              <span className="text-muted-foreground/50">
                                ({formatDeadline(job.deadline)})
                              </span>
                            )}
                          </div>

                          {/* Association */}
                          <div className="mt-4 pt-4 border-t border-border/30">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {job.association?.name || "FICAV"}
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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

        {/* CTA Section - Only for association members */}
        {isAssociationMember && (
          <section className="py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
                Vous souhaitez publier une offre ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Les administrateurs d'associations membres peuvent publier des offres 
                d'emploi, castings et appels à projets.
              </p>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange">
                    <Plus className="w-4 h-4 mr-2" />
                    Publier une offre
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Publier une nouvelle offre</DialogTitle>
                    <DialogDescription>
                      Remplissez le formulaire ci-dessous. Votre offre sera soumise à validation par le Directeur de la Communication.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Titre *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Ex: Assistant à la réalisation"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Type d'offre *</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EMPLOI">Emploi</SelectItem>
                            <SelectItem value="CASTING">Casting</SelectItem>
                            <SelectItem value="APPEL_PROJET">Appel à projets</SelectItem>
                            <SelectItem value="STAGE">Stage</SelectItem>
                            <SelectItem value="FORMATION">Formation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Décrivez l'offre en détail..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Lieu</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Ex: Abidjan, Plateau"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="salary">Rémunération</Label>
                        <Input
                          id="salary"
                          value={formData.salary}
                          onChange={(e) => setFormData({...formData, salary: e.target.value})}
                          placeholder="Ex: 500 000 FCFA/mois"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deadline">Date limite</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                          id="isRemote"
                          checked={formData.isRemote}
                          onCheckedChange={(checked) => setFormData({...formData, isRemote: checked as boolean})}
                        />
                        <Label htmlFor="isRemote" className="cursor-pointer">
                          Télétravail possible
                        </Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Exigences (une par ligne)</Label>
                      <Textarea
                        id="requirements"
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        placeholder="Minimum 2 ans d'expérience&#10;Maîtrise des outils Adobe&#10;Disponibilité totale"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email de contact</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                          placeholder="contact@association.ci"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Téléphone de contact</Label>
                        <Input
                          id="contactPhone"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                          placeholder="+225 07 00 00 00 00"
                        />
                      </div>
                    </div>
                    
                    {association && (
                      <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          Publié au nom de: <strong>{association.name}</strong>
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Soumission...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Soumettre pour validation
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
