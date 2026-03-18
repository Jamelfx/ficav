"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, Grid, List, Map, Users, Film, Calendar, 
  MapPin, Phone, Mail, Globe, ChevronDown, Filter,
  Building2, CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Types
type AssociationStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

interface Association {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  description: string | null;
  category: string | null;
  city: string | null;
  status: AssociationStatus;
  latitude: number | null;
  longitude: number | null;
  _count: {
    members: number;
    films: number;
    events: number;
  };
}

interface AssociationsResponse {
  associations: Association[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    cities: string[];
    categories: string[];
  };
}

// Category colors
const categoryColors: Record<string, string> = {
  "Réalisation": "bg-gradient-to-r from-orange-500 to-amber-500",
  "Production": "bg-gradient-to-r from-emerald-500 to-teal-500",
  "Interprétation": "bg-gradient-to-r from-purple-500 to-violet-500",
  "Technique": "bg-gradient-to-r from-blue-500 to-cyan-500",
  "Écriture": "bg-gradient-to-r from-rose-500 to-pink-500",
};

// Status config
const statusConfig: Record<AssociationStatus, { label: string; color: string; icon: React.ElementType }> = {
  ACTIVE: { label: "Active", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  PENDING: { label: "En attente", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Clock },
  SUSPENDED: { label: "Suspendue", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertCircle },
};

const categories = ["Réalisation", "Production", "Interprétation", "Technique", "Écriture"];

export default function AssociationsPage() {
  const [data, setData] = useState<AssociationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch associations
  useEffect(() => {
    const fetchAssociations = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (categoryFilter !== "all") params.set("category", categoryFilter);
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (cityFilter !== "all") params.set("city", cityFilter);
        
        const response = await fetch(`/api/associations?${params.toString()}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching associations:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchAssociations, 300);
    return () => clearTimeout(debounce);
  }, [search, categoryFilter, statusFilter, cityFilter]);

  // Filter summary
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    if (cityFilter !== "all") count++;
    if (search) count++;
    return count;
  }, [categoryFilter, statusFilter, cityFilter, search]);

  return (
    <div className="min-h-screen bg-gradient-cinema">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-semibold">FICAV</h1>
                <p className="text-xs text-muted-foreground">Fédération du Cinéma Ivoirien</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/associations" className="text-primary font-medium">Associations</Link>
              <Link href="/films" className="text-muted-foreground hover:text-foreground transition-colors">Films</Link>
              <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">Événements</Link>
              <Link href="/professionals" className="text-muted-foreground hover:text-foreground transition-colors">Professionnels</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Répertoire Officiel
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4">
              Associations Membres
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez les associations professionnelles qui composent la FICAV et font vivre le cinéma ivoirien.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une association..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 bg-secondary/50 border-border/50"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 border-border/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>

              {/* View Mode Toggle */}
              <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("map")}
                  className="h-10 w-10"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50"
                >
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Catégorie</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Statut</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="SUSPENDED">Suspendue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Ville</label>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Toutes les villes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les villes</SelectItem>
                        {data?.filters.cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Associations", value: data?.pagination.total || 0, icon: Building2 },
              { label: "Membres", value: data?.associations.reduce((sum, a) => sum + a._count.members, 0) || 0, icon: Users },
              { label: "Films", value: data?.associations.reduce((sum, a) => sum + a._count.films, 0) || 0, icon: Film },
              { label: "Événements", value: data?.associations.reduce((sum, a) => sum + a._count.events, 0) || 0, icon: Calendar },
            ].map((stat, index) => (
              <div key={stat.label} className="glass-card-light rounded-xl p-4 text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            // Loading skeleton
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 shimmer h-64" />
              ))}
            </div>
          ) : viewMode === "map" ? (
            // Map View
            <div className="glass-card rounded-2xl p-6">
              <AssociationsMap associations={data?.associations || []} />
            </div>
          ) : (
            // Grid/List View
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              <AnimatePresence mode="popLayout">
                {data?.associations.map((association, index) => (
                  <motion.div
                    key={association.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <AssociationCard association={association} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Empty State */}
          {!loading && data?.associations.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune association trouvée</h3>
              <p className="text-muted-foreground">Essayez de modifier vos filtres de recherche.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 FICAV - Fédération Ivoirienne du Cinéma et de l'Audiovisuel</p>
        </div>
      </footer>
    </div>
  );
}

// Association Card Component
function AssociationCard({ association, viewMode }: { association: Association; viewMode: "grid" | "list" }) {
  const status = statusConfig[association.status];
  const StatusIcon = status.icon;
  const categoryColor = categoryColors[association.category || ""] || "bg-gradient-to-r from-gray-500 to-gray-600";

  if (viewMode === "list") {
    return (
      <Link href={`/associations/${association.slug}`}>
        <Card className="glass-card hover:border-primary/30 transition-all group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                {association.logo ? (
                  <Image
                    src={association.logo}
                    alt={association.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg truncate">{association.name}</h3>
                  <Badge className={`${status.color} border text-xs`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                  {association.description || "Aucune description"}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {association.category && (
                    <Badge className={`${categoryColor} text-white text-xs`}>
                      {association.category}
                    </Badge>
                  )}
                  {association.city && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {association.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {association._count.members} membres
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Film className="w-3 h-3" />
                    {association._count.films} films
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Grid view
  return (
    <Link href={`/associations/${association.slug}`}>
      <Card className="glass-card hover:border-primary/30 transition-all group cursor-pointer h-full">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
              {association.logo ? (
                <Image
                  src={association.logo}
                  alt={association.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-7 h-7 text-muted-foreground" />
              )}
            </div>
            <Badge className={`${status.color} border text-xs`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {association.name}
          </h3>

          {/* Category */}
          {association.category && (
            <Badge className={`${categoryColor} text-white text-xs mb-3`}>
              {association.category}
            </Badge>
          )}

          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 min-h-[40px]">
            {association.description || "Aucune description disponible"}
          </p>

          {/* Location */}
          {association.city && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
              <MapPin className="w-3 h-3" />
              {association.city}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{association._count.members}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Film className="w-4 h-4" />
              <span>{association._count.films}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{association._count.events}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Map Component (Placeholder - Leaflet not installed)
function AssociationsMap({ associations }: { associations: Association[] }) {
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  
  // Filter associations with coordinates
  const associationsWithCoords = associations.filter(a => a.latitude && a.longitude);

  if (associationsWithCoords.length === 0) {
    return (
      <div className="h-[500px] rounded-xl bg-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune donnée géographique</h3>
          <p className="text-muted-foreground">
            Les associations n'ont pas encore de coordonnées géographiques enregistrées.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-[500px] rounded-xl bg-secondary/30 relative overflow-hidden">
        {/* Placeholder Map Visualization */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.1)_0%,transparent_70%)]" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Association markers */}
        <div className="absolute inset-0 p-4">
          {associationsWithCoords.map((association, index) => {
            // Simple positioning based on index for demo
            const col = index % 4;
            const row = Math.floor(index / 4);
            const left = 15 + col * 22;
            const top = 15 + row * 25;

            return (
              <motion.button
                key={association.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedAssociation(association)}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedAssociation?.id === association.id 
                    ? "bg-primary scale-125 shadow-lg shadow-primary/50" 
                    : "bg-gradient-to-br from-orange-500 to-amber-600 hover:scale-110"
                }`}
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <Building2 className="w-5 h-5 text-white" />
              </motion.button>
            );
          })}
        </div>

        {/* Map attribution */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Carte interactive
        </div>
      </div>

      {/* Selected Association Info */}
      <AnimatePresence>
        {selectedAssociation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 glass-card-light rounded-xl p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{selectedAssociation.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedAssociation.city} • {selectedAssociation._count.members} membres
                </p>
              </div>
              <Link href={`/associations/${selectedAssociation.slug}`}>
                <Button size="sm" variant="outline">
                  Voir le profil
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-600" />
          <span>Association active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Sélectionnée</span>
        </div>
      </div>
    </div>
  );
}
