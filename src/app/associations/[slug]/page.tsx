"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, MapPin, Phone, Mail, Globe, Users, Film, Calendar,
  Building2, CheckCircle, Clock, AlertCircle, Award, ExternalLink,
  User, Briefcase, CreditCard, Play, Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Types
type AssociationStatus = "ACTIVE" | "SUSPENDED" | "PENDING";
type PaymentStatus = "PAID" | "PENDING" | "OVERDUE" | "CANCELLED";
type EventType = "FESTIVAL" | "ASSEMBLY" | "TRAINING" | "PROJECTION" | "CONFERENCE" | "WORKSHOP";

interface Member {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  isVerified: boolean;
  badges: { type: string }[];
}

interface Film {
  id: string;
  slug: string;
  title: string;
  poster: string | null;
  year: number;
  genre: string | null;
}

interface Event {
  id: string;
  slug: string;
  title: string;
  type: EventType;
  startDate: string;
  venue: string | null;
  city: string | null;
  image: string | null;
}

interface Cotisation {
  id: string;
  year: number;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt: string | null;
}

interface Association {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  description: string | null;
  category: string | null;
  president: string | null;
  vicePresident: string | null;
  secretary: string | null;
  treasurer: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  status: AssociationStatus;
  createdAt: string;
  members: Member[];
  memberCount: number;
  films: Film[];
  events: Event[];
  cotisations: Cotisation[];
  cotisationStatus: PaymentStatus;
}

// Status config
const statusConfig: Record<AssociationStatus, { label: string; color: string; icon: React.ElementType }> = {
  ACTIVE: { label: "Active", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  PENDING: { label: "En attente", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Clock },
  SUSPENDED: { label: "Suspendue", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertCircle },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  PAID: { label: "Payée", color: "bg-emerald-500/20 text-emerald-400" },
  PENDING: { label: "En attente", color: "bg-amber-500/20 text-amber-400" },
  OVERDUE: { label: "En retard", color: "bg-red-500/20 text-red-400" },
  CANCELLED: { label: "Annulée", color: "bg-gray-500/20 text-gray-400" },
};

const categoryColors: Record<string, string> = {
  "Réalisation": "bg-gradient-to-r from-orange-500 to-amber-500",
  "Production": "bg-gradient-to-r from-emerald-500 to-teal-500",
  "Interprétation": "bg-gradient-to-r from-purple-500 to-violet-500",
  "Technique": "bg-gradient-to-r from-blue-500 to-cyan-500",
  "Écriture": "bg-gradient-to-r from-rose-500 to-pink-500",
};

const eventTypeLabels: Record<EventType, string> = {
  FESTIVAL: "Festival",
  ASSEMBLY: "Assemblée",
  TRAINING: "Formation",
  PROJECTION: "Projection",
  CONFERENCE: "Conférence",
  WORKSHOP: "Atelier",
};

export default function AssociationProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [association, setAssociation] = useState<Association | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const response = await fetch(`/api/associations/${slug}`);
        if (!response.ok) {
          throw new Error("Association not found");
        }
        const data = await response.json();
        setAssociation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load association");
      } finally {
        setLoading(false);
      }
    };

    fetchAssociation();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-cinema">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="shimmer h-64 rounded-2xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 shimmer h-96 rounded-2xl" />
            <div className="shimmer h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !association) {
    return (
      <div className="min-h-screen bg-gradient-cinema flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Association non trouvée</h1>
          <p className="text-muted-foreground mb-6">{error || "Cette association n'existe pas."}</p>
          <Link href="/associations">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux associations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[association.status];
  const StatusIcon = status.icon;
  const paymentStatus = paymentStatusConfig[association.cotisationStatus];
  const categoryColor = categoryColors[association.category || ""] || "bg-gradient-to-r from-gray-500 to-gray-600";

  return (
    <div className="min-h-screen bg-gradient-cinema">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/associations" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Associations</span>
            </Link>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-semibold">FICAV</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Logo */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
                {association.logo ? (
                  <Image
                    src={association.logo}
                    alt={association.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{association.name}</h1>
                  <Badge className={`${status.color} border`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                {association.category && (
                  <Badge className={`${categoryColor} text-white mb-4`}>
                    {association.category}
                  </Badge>
                )}

                {association.description && (
                  <p className="text-muted-foreground mb-4 max-w-2xl">{association.description}</p>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">{association.memberCount}</span>
                    <span className="text-muted-foreground text-sm">membres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    <span className="font-medium">{association.films.length}</span>
                    <span className="text-muted-foreground text-sm">films</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">{association.events.length}</span>
                    <span className="text-muted-foreground text-sm">événements</span>
                  </div>
                </div>

                {/* Cotisation Status */}
                <div className="mt-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Cotisation 2024:</span>
                  <Badge className={`${paymentStatus.color}`}>
                    {paymentStatus.label}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Leadership Team */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Bureau Exécutif
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { role: "Président", name: association.president, icon: User },
                        { role: "Vice-Président", name: association.vicePresident, icon: User },
                        { role: "Secrétaire", name: association.secretary, icon: User },
                        { role: "Trésorier", name: association.treasurer, icon: User },
                      ].map((item) => (
                        <div 
                          key={item.role} 
                          className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-600/20 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{item.role}</p>
                            <p className="font-medium">{item.name || "Non renseigné"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Members Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Membres
                    </CardTitle>
                    {association.memberCount > 10 && (
                      <Button variant="ghost" size="sm">
                        Voir tous ({association.memberCount})
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {association.members.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {association.members.map((member) => (
                          <div key={member.id} className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                            <Avatar className="w-12 h-12 mb-2">
                              <AvatarImage src={member.avatar || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-sm truncate w-full">{member.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{member.role.toLowerCase()}</p>
                            {member.isVerified && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Vérifié
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Aucun membre enregistré</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Films */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-primary" />
                      Films Produits
                    </CardTitle>
                    {association.films.length > 6 && (
                      <Button variant="ghost" size="sm">
                        Voir tous ({association.films.length})
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {association.films.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {association.films.slice(0, 6).map((film) => (
                          <Link 
                            key={film.id} 
                            href={`/films/${film.slug}`}
                            className="group"
                          >
                            <div className="aspect-[2/3] rounded-xl bg-secondary overflow-hidden mb-2 relative">
                              {film.poster ? (
                                <Image
                                  src={film.poster}
                                  alt={film.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                              )}
                              <div className="absolute bottom-2 left-2 right-2">
                                <Badge className="bg-background/80 backdrop-blur text-xs">
                                  {film.year}
                                </Badge>
                              </div>
                            </div>
                            <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {film.title}
                            </h4>
                            {film.genre && (
                              <p className="text-xs text-muted-foreground">{film.genre}</p>
                            )}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Aucun film enregistré</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Événements Organisés
                    </CardTitle>
                    {association.events.length > 6 && (
                      <Button variant="ghost" size="sm">
                        Voir tous ({association.events.length})
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {association.events.length > 0 ? (
                      <div className="space-y-3">
                        {association.events.slice(0, 6).map((event) => (
                          <Link 
                            key={event.id} 
                            href={`/events/${event.slug}`}
                            className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                          >
                            <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden shrink-0 relative">
                              {event.image ? (
                                <Image
                                  src={event.image}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Calendar className="w-6 h-6 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {eventTypeLabels[event.type]}
                                </Badge>
                                <span>
                                  {new Date(event.startDate).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                  })}
                                </span>
                              </div>
                              {event.venue && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {event.venue}{event.city && `, ${event.city}`}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Aucun événement enregistré</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Coordonnées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {association.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm">{association.address}</p>
                          {association.city && (
                            <p className="text-sm text-muted-foreground">{association.city}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {association.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                        <a href={`tel:${association.phone}`} className="text-sm hover:text-primary transition-colors">
                          {association.phone}
                        </a>
                      </div>
                    )}

                    {association.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                        <a href={`mailto:${association.email}`} className="text-sm hover:text-primary transition-colors truncate">
                          {association.email}
                        </a>
                      </div>
                    )}

                    {association.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                        <a 
                          href={association.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:text-primary transition-colors truncate flex items-center gap-1"
                        >
                          {association.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="text-sm text-muted-foreground">
                      <p>Membre depuis {" "}
                        {new Date(association.createdAt).toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Cotisations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Cotisations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {association.cotisations.length > 0 ? (
                      <div className="space-y-3">
                        {association.cotisations.map((cotisation) => {
                          const cStatus = paymentStatusConfig[cotisation.status];
                          return (
                            <div 
                              key={cotisation.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
                            >
                              <div>
                                <p className="font-medium">{cotisation.year}</p>
                                <p className="text-sm text-muted-foreground">
                                  {cotisation.amount.toLocaleString("fr-FR")} FCFA
                                </p>
                              </div>
                              <Badge className={`${cStatus.color}`}>
                                {cStatus.label}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucune cotisation</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Location Map */}
              {association.latitude && association.longitude && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Localisation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 rounded-xl bg-secondary/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.1)_0%,transparent_70%)]" />
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-primary/30">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        {association.city && (
                          <div className="absolute bottom-2 left-2 right-2 text-center">
                            <Badge className="bg-background/80 backdrop-blur">
                              {association.city}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex flex-col gap-3">
                  {association.email && (
                    <Button className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contacter l'association
                    </Button>
                  )}
                  {association.website && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={association.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Visiter le site web
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
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
