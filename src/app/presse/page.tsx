"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  X,
  Send,
  FileDown,
  ImageIcon,
  Palette,
  ChevronRight,
  Images,
} from "lucide-react";
import { FederationNav } from "@/components/federation/FederationNav";
import { FederationFooter } from "@/components/federation/FederationFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Types
interface PressRelease {
  id: string;
  slug: string;
  title: string;
  content: string;
  type: string;
  attachmentUrl: string | null;
  publishedAt: string;
}

interface PressReleasesResponse {
  pressReleases: PressRelease[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const typeLabels: Record<string, string> = {
  communiqué: "Communiqué",
  dossier: "Dossier de presse",
  conférence: "Conférence",
};

const typeColors: Record<string, string> = {
  communiqué: "bg-primary text-primary-foreground",
  dossier: "bg-blue-500 text-white",
  conférence: "bg-purple-500 text-white",
};

export default function PressePage() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    async function fetchPressReleases() {
      try {
        const params = new URLSearchParams();
        if (filterType !== "all") params.set("type", filterType);
        if (searchQuery) params.set("search", searchQuery);

        const response = await fetch(`/api/press-releases?${params.toString()}`);
        const data: PressReleasesResponse = await response.json();
        setPressReleases(data.pressReleases);
      } catch (error) {
        console.error("Failed to fetch press releases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPressReleases();
  }, [filterType, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already triggered by useEffect
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setFormSubmitting(false);
    setFormSubmitted(true);
    setContactForm({ name: "", email: "", organization: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <FederationNav />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4">
              Espace Presse
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Retrouvez nos communiqués, dossiers de presse et ressources pour
              les journalistes
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Tabs defaultValue="releases" className="space-y-8">
              <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto">
                <TabsTrigger value="releases">Communiqués</TabsTrigger>
                <TabsTrigger value="kit">Kit Presse</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {/* Press Releases Tab */}
              <TabsContent value="releases">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>
                  <div className="flex gap-2">
                    {["all", "communiqué", "dossier", "conférence"].map((type) => (
                      <Button
                        key={type}
                        variant={filterType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType(type)}
                        className="whitespace-nowrap"
                      >
                        {type === "all" ? "Tous" : typeLabels[type]}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Press Releases List */}
                {loading ? (
                  <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-32 rounded-2xl bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pressReleases.map((release, index) => (
                      <motion.div
                        key={release.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Card
                          className="glass-card cursor-pointer hover:border-primary/30 transition-colors"
                          onClick={() => setSelectedRelease(release)}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge className={typeColors[release.type]}>
                                    {typeLabels[release.type]}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(release.publishedAt), "d MMMM yyyy", {
                                      locale: fr,
                                    })}
                                  </span>
                                </div>
                                <h3 className="font-medium text-lg mb-2 line-clamp-2">
                                  {release.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                  {release.content.substring(0, 150)}...
                                </p>
                              </div>
                              <div className="flex sm:flex-col items-center gap-2">
                                {release.attachmentUrl && (
                                  <Badge variant="outline" className="gap-1">
                                    <FileText className="w-3 h-3" />
                                    PDF
                                  </Badge>
                                )}
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Press Kit Tab */}
              <TabsContent value="kit">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Press Kit PDF */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="glass-card h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <FileDown className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">
                          Dossier de Presse
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Téléchargez le dossier de presse complet de la FICAV
                        </p>
                        <Button className="gap-2">
                          <Download className="w-4 h-4" />
                          Télécharger PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Logo Pack */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Card className="glass-card h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <ImageIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">
                          Logos Haute Résolution
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Logos FICAV en format PNG et vectoriel
                        </p>
                        <Button className="gap-2">
                          <Download className="w-4 h-4" />
                          Télécharger
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Brand Guidelines */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Card className="glass-card h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <Palette className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">
                          Chartre Graphique
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Guide d&apos;utilisation de la marque FICAV
                        </p>
                        <Button className="gap-2">
                          <Download className="w-4 h-4" />
                          Télécharger PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Photos */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Card className="glass-card h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <Images className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">
                          Photos & Visuels
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Photos haute résolution pour la presse
                        </p>
                        <Button className="gap-2">
                          <Download className="w-4 h-4" />
                          Accéder
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Key Facts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="md:col-span-2"
                  >
                    <Card className="glass-card h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">Chiffres Clés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-primary">12</p>
                            <p className="text-sm text-muted-foreground">
                              Associations
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-primary">250+</p>
                            <p className="text-sm text-muted-foreground">
                              Films
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-primary">1250+</p>
                            <p className="text-sm text-muted-foreground">
                              Techniciens
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-primary">35+</p>
                            <p className="text-sm text-muted-foreground">
                              Années
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-primary" />
                          Contact Presse
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {formSubmitted ? (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                              <Send className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">
                              Message envoyé !
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              Nous vous répondrons dans les plus brefs délais.
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => setFormSubmitted(false)}
                            >
                              Envoyer un autre message
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input
                                  id="name"
                                  value={contactForm.name}
                                  onChange={(e) =>
                                    setContactForm({
                                      ...contactForm,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={contactForm.email}
                                  onChange={(e) =>
                                    setContactForm({
                                      ...contactForm,
                                      email: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="organization">
                                Organisation / Média
                              </Label>
                              <Input
                                id="organization"
                                value={contactForm.organization}
                                onChange={(e) =>
                                  setContactForm({
                                    ...contactForm,
                                    organization: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="message">Message</Label>
                              <Textarea
                                id="message"
                                rows={5}
                                value={contactForm.message}
                                onChange={(e) =>
                                  setContactForm({
                                    ...contactForm,
                                    message: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full gap-2"
                              disabled={formSubmitting}
                            >
                              {formSubmitting ? (
                                <>
                                  <span className="animate-spin">⏳</span>
                                  Envoi en cours...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Envoyer
                                </>
                              )}
                            </Button>
                          </form>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-6"
                  >
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Bureau de Presse</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Adresse</p>
                            <p className="text-muted-foreground">
                              Palais de la Culture
                              <br />
                              Treichville, Abidjan
                              <br />
                              Côte d&apos;Ivoire
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Téléphone</p>
                            <p className="text-muted-foreground">
                              +225 27 22 XX XX XX
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Email Presse</p>
                            <a
                              href="mailto:presse@ficav.ci"
                              className="text-primary hover:underline"
                            >
                              presse@ficav.ci
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Horaires d&apos;ouverture</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Lundi - Vendredi
                            </span>
                            <span>8h00 - 17h00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Samedi
                            </span>
                            <span>9h00 - 12h00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Dimanche
                            </span>
                            <span className="text-muted-foreground">Fermé</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Service Presse</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          Pour toute demande d&apos;accréditation, d&apos;interview ou
                          d&apos;information complémentaire, n&apos;hésitez pas à
                          contacter notre service presse.
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">AD</span>
                          </div>
                          <div>
                            <p className="font-medium">Aminata Diallo</p>
                            <p className="text-sm text-muted-foreground">
                              Responsable Communication
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Press Release Detail Modal */}
      <Dialog open={!!selectedRelease} onOpenChange={() => setSelectedRelease(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRelease && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={typeColors[selectedRelease.type]}>
                    {typeLabels[selectedRelease.type]}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(selectedRelease.publishedAt), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </span>
                </div>
                <DialogTitle className="text-xl">
                  {selectedRelease.title}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription asChild>
                <div className="mt-4 space-y-4">
                  <div className="whitespace-pre-line text-foreground">
                    {selectedRelease.content}
                  </div>
                  {selectedRelease.attachmentUrl && (
                    <div className="pt-4 border-t border-border">
                      <Button className="gap-2">
                        <Download className="w-4 h-4" />
                        Télécharger le document
                      </Button>
                    </div>
                  )}
                </div>
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>

      <FederationFooter />
    </div>
  );
}
