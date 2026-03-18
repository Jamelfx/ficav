"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Globe,
  Save,
  Eye,
  FileText,
  ImageIcon,
  Newspaper,
  Settings,
  Palette,
  Layout,
  RefreshCw,
  Upload,
  Trash2,
  Edit,
  Plus,
  Check,
  X,
  ExternalLink,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Types
type FederationSettings = {
  id?: string;
  logoUrl: string | null;
  logoWidth: number;
  logoHeight: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  facebook: string | null;
  twitter: string | null;
  youtube: string | null;
  instagram: string | null;
  linkedin: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroDescription: string | null;
  heroImageUrl: string | null;
};

type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
};

type GalleryAlbum = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  coverImage: string | null;
  isPublished: boolean;
  order: number;
  photos?: { id: string; url: string; title: string | null }[];
  _count?: { photos: number };
};

const defaultSettings: FederationSettings = {
  logoUrl: "/images/logo-ficav-official.png",
  logoWidth: 48,
  logoHeight: 48,
  primaryColor: "#F97316",
  secondaryColor: "#FFFFFF",
  accentColor: "#000000",
  email: "contact@ficav.ci",
  phone: "+225 07 00 00 00 00",
  address: "Immeuble FICAV, Plateau, Abidjan, Côte d'Ivoire",
  facebook: "",
  twitter: "",
  youtube: "",
  instagram: "",
  linkedin: "",
  heroTitle: "Fédération Ivoirienne du Cinéma et de l'Audiovisuel",
  heroSubtitle: "Le rendez-vous du cinéma ivoirien",
  heroDescription: "FICAV regroupe les associations de professionnels du cinéma et de l'audiovisuel en Côte d'Ivoire.",
  heroImageUrl: "",
};

export default function WebsitePage() {
  const [settings, setSettings] = useState<FederationSettings>(defaultSettings);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const newsImageRef = useRef<HTMLInputElement>(null);
  const albumCoverRef = useRef<HTMLInputElement>(null);

  // Dialog states
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsArticle>>({});
  const [editingAlbum, setEditingAlbum] = useState<Partial<GalleryAlbum>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch settings
      const settingsRes = await fetch("/api/federation/settings");
      const settingsData = await settingsRes.json();
      if (settingsData && !settingsData.error) {
        setSettings({ ...defaultSettings, ...settingsData });
      }

      // Fetch news
      const newsRes = await fetch("/api/federation/news");
      const newsData = await newsRes.json();
      setNews(Array.isArray(newsData.news) ? newsData.news : (Array.isArray(newsData) ? newsData : []));

      // Fetch albums
      const albumsRes = await fetch("/api/federation/gallery");
      const albumsData = await albumsRes.json();
      setAlbums(Array.isArray(albumsData) ? albumsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/federation/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "settings",
          ...settings,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Paramètres enregistrés avec succès");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  // Save settings to database
  const persistSettings = async (newSettings: FederationSettings) => {
    try {
      const response = await fetch("/api/federation/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error("Failed to save settings");
      
      return true;
    } catch (error) {
      console.error("Error persisting settings:", error);
      return false;
    }
  };

  // Upload file
  const handleFileUpload = async (
    file: File,
    type: "logo" | "hero" | "news" | "album"
  ) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/federation/settings/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      let newSettings = { ...settings };
      
      if (type === "logo") {
        newSettings = { ...settings, logoUrl: data.url };
        setSettings(newSettings);
      } else if (type === "hero") {
        newSettings = { ...settings, heroImageUrl: data.url };
        setSettings(newSettings);
      } else if (type === "news") {
        setEditingNews({ ...editingNews, image: data.url });
      } else if (type === "album") {
        setEditingAlbum({ ...editingAlbum, coverImage: data.url });
      }

      // Auto-save settings when uploading logo or hero image
      if (type === "logo" || type === "hero") {
        const saved = await persistSettings(newSettings);
        if (saved) {
          toast.success("Image mise à jour et sauvegardée avec succès");
        } else {
          toast.error("Image uploadée mais erreur lors de la sauvegarde");
        }
      } else {
        toast.success("Image mise à jour avec succès");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erreur lors de l'upload du fichier");
    } finally {
      setIsUploading(false);
    }
  };

  // News CRUD
  const handleSaveNews = async () => {
    try {
      const method = editingNews.id ? "PUT" : "POST";
      const response = await fetch("/api/federation/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingNews),
      });

      if (!response.ok) throw new Error("Failed to save news");

      toast.success(editingNews.id ? "Article mis à jour" : "Article créé");
      setIsNewsDialogOpen(false);
      setEditingNews({});
      fetchData();
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error("Erreur lors de la sauvegarde de l'article");
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const response = await fetch(`/api/federation/news?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Article supprimé");
      fetchData();
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Album CRUD
  const handleSaveAlbum = async () => {
    try {
      const method = editingAlbum.id ? "PUT" : "POST";
      const response = await fetch("/api/federation/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAlbum),
      });

      if (!response.ok) throw new Error("Failed to save album");

      toast.success(editingAlbum.id ? "Album mis à jour" : "Album créé");
      setIsAlbumDialogOpen(false);
      setEditingAlbum({});
      fetchData();
    } catch (error) {
      console.error("Error saving album:", error);
      toast.error("Erreur lors de la sauvegarde de l'album");
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet album et toutes ses photos ?")) return;

    try {
      const response = await fetch(`/api/federation/gallery?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Album supprimé");
      fetchData();
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
            Gestion du site web
          </h1>
          <p className="text-muted-foreground">
            Modifiez le contenu du site - Les changements seront appliqués en temps réel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Voir le site
            </a>
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Impact Banner */}
      <Card className="glass-card border-green-500/30 bg-green-500/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-green-400">Changements en temps réel</p>
              <p className="text-sm text-muted-foreground">
                Vos modifications sont automatiquement appliquées sur le site public
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Articles publiés", value: news.filter(n => n.isPublished).length, icon: Newspaper },
          { label: "Albums photos", value: albums.length, icon: ImageIcon },
          { label: "Photos", value: albums.reduce((acc, a) => acc + (a._count?.photos || 0), 0), icon: ImageIcon },
          { label: "Dernière MAJ", value: "Aujourd'hui", icon: RefreshCw },
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
                    <p className="text-xl font-display font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="hero">
            <Layout className="w-4 h-4 mr-2" />
            Accueil
          </TabsTrigger>
          <TabsTrigger value="news">
            <Newspaper className="w-4 h-4 mr-2" />
            Actualités
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <ImageIcon className="w-4 h-4 mr-2" />
            Galerie
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-lg">Section Hero (Page d&apos;accueil)</CardTitle>
              <CardDescription>
                Cette section apparaît en haut de la page d&apos;accueil du site public
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Titre principal</Label>
                    <Input
                      id="hero-title"
                      value={settings.heroTitle || ""}
                      onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Sous-titre</Label>
                    <Input
                      id="hero-subtitle"
                      value={settings.heroSubtitle || ""}
                      onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-description">Description</Label>
                    <Textarea
                      id="hero-description"
                      value={settings.heroDescription || ""}
                      onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Image de fond Hero</Label>
                    <div className="flex flex-col items-start gap-4">
                      <div className="w-full h-32 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden relative">
                        {settings.heroImageUrl ? (
                          <Image
                            src={settings.heroImageUrl}
                            alt="Hero background"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <input
                        ref={heroInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "hero");
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => heroInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? "Upload en cours..." : "Changer l'image"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 rounded-lg bg-muted/30 border">
                <p className="text-sm font-medium mb-3">Aperçu:</p>
                <div className="bg-gradient-to-br from-primary/20 to-background rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    {settings.heroTitle || "FICAV"}
                  </h2>
                  <p className="text-muted-foreground">{settings.heroSubtitle}</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    {settings.heroDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Section */}
        <TabsContent value="news">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold">Articles d&apos;actualité</h3>
                <p className="text-sm text-muted-foreground">
                  Ces articles apparaissent dans la section &quot;Actualités&quot; du site public
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setEditingNews({
                    isPublished: true,
                    isFeatured: false,
                    publishedAt: new Date().toISOString().split("T")[0],
                  });
                  setIsNewsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel article
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((article) => (
                <Card key={article.id} className="glass-card border-border/30">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg bg-muted/50 overflow-hidden flex-shrink-0 relative">
                        {article.image ? (
                          <Image src={article.image} alt="" fill className="object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 m-auto text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium line-clamp-2">{article.title}</h4>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingNews(article);
                                setIsNewsDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteNews(article.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {article.isFeatured && (
                            <Badge className="bg-primary text-primary-foreground text-xs">À la une</Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={
                              article.isPublished
                                ? "border-green-500/50 text-green-400 text-xs"
                                : "border-yellow-500/50 text-yellow-400 text-xs"
                            }
                          >
                            {article.isPublished ? "Publié" : "Brouillon"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {news.length === 0 && (
                <Card className="glass-card border-border/30 col-span-full">
                  <CardContent className="p-8 text-center">
                    <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucun article publié
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Gallery Section */}
        <TabsContent value="gallery">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold">Albums photos</h3>
                <p className="text-sm text-muted-foreground">
                  Ces albums apparaissent dans la galerie du site public
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setEditingAlbum({
                    isPublished: true,
                  });
                  setIsAlbumDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel album
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {albums.map((album) => (
                <Card key={album.id} className="glass-card border-border/30">
                  <CardContent className="p-4">
                    <div className="aspect-video rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden relative mb-4">
                      {album.coverImage ? (
                        <Image src={album.coverImage} alt={album.title} fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{album.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {album._count?.photos || 0} photo(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingAlbum(album);
                            setIsAlbumDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteAlbum(album.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {albums.length === 0 && (
                <Card className="glass-card border-border/30 col-span-full">
                  <CardContent className="p-8 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucun album créé
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Settings Section */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Management */}
            <Card className="glass-card border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Logo de la Fédération
                </CardTitle>
                <CardDescription>
                  Ce logo apparaît dans la navigation et sur les cartes d&apos;accès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {/* Logo Preview */}
                  <div className="relative w-32 h-32 rounded-xl bg-white border-2 border-border flex items-center justify-center overflow-hidden shadow-lg">
                    {settings.logoUrl ? (
                      <Image
                        src={settings.logoUrl}
                        alt="FICAV Logo"
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <Globe className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>

                  {/* Upload Button */}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "logo");
                    }}
                  />
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Upload en cours..." : "Changer le logo"}
                  </Button>

                  {/* Size Settings */}
                  <div className="grid grid-cols-2 gap-2 w-full mt-2">
                    <div className="space-y-1">
                      <Label htmlFor="logo-width" className="text-xs">Largeur (px)</Label>
                      <Input
                        id="logo-width"
                        type="number"
                        value={settings.logoWidth}
                        onChange={(e) => setSettings({ ...settings, logoWidth: parseInt(e.target.value) || 48 })}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="logo-height" className="text-xs">Hauteur (px)</Label>
                      <Input
                        id="logo-height"
                        type="number"
                        value={settings.logoHeight}
                        onChange={(e) => setSettings({ ...settings, logoHeight: parseInt(e.target.value) || 48 })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand Colors */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Couleurs de la marque
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border shadow-inner"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Couleur principale</Label>
                      <div className="flex gap-2">
                        <Input
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="h-8 font-mono text-xs"
                        />
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border shadow-inner bg-white"
                    />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Couleur secondaire</Label>
                      <div className="flex gap-2">
                        <Input
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="h-8 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border shadow-inner bg-black"
                    />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Couleur d&apos;accent</Label>
                      <div className="flex gap-2">
                        <Input
                          value={settings.accentColor}
                          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                          className="h-8 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Presets */}
                <div className="pt-4 border-t">
                  <Label className="text-xs text-muted-foreground">Préréglages</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        primaryColor: "#F97316",
                        secondaryColor: "#FFFFFF",
                        accentColor: "#000000",
                      })}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      FICAV (Défaut)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        primaryColor: "#2563EB",
                        secondaryColor: "#FFFFFF",
                        accentColor: "#1E40AF",
                      })}
                    >
                      Bleu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        primaryColor: "#10B981",
                        secondaryColor: "#FFFFFF",
                        accentColor: "#059669",
                      })}
                    >
                      Vert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email principal</Label>
                  <Input
                    id="email"
                    value={settings.email || ""}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={settings.phone || ""}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={settings.address || ""}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Réseaux sociaux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/ficav"
                    value={settings.facebook || ""}
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/ficav"
                    value={settings.twitter || ""}
                    onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    placeholder="https://youtube.com/ficav"
                    value={settings.youtube || ""}
                    onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/ficav"
                    value={settings.instagram || ""}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/company/ficav"
                    value={settings.linkedin || ""}
                    onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* News Dialog */}
      <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
        <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingNews.id ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
            <DialogDescription>
              Créez ou modifiez un article d&apos;actualité pour le site public
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={editingNews.title || ""}
                onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                placeholder="Titre de l'article"
              />
            </div>
            <div className="space-y-2">
              <Label>Extrait</Label>
              <Textarea
                value={editingNews.excerpt || ""}
                onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                placeholder="Bref résumé de l'article"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea
                value={editingNews.content || ""}
                onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                placeholder="Contenu complet de l'article"
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg bg-muted/50 overflow-hidden relative">
                  {editingNews.image ? (
                    <Image src={editingNews.image} alt="" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 m-auto text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    ref={newsImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "news");
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => newsImageRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Upload..." : "Télécharger"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={editingNews.isPublished}
                  onChange={(e) => setEditingNews({ ...editingNews, isPublished: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isPublished">Publié</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={editingNews.isFeatured}
                  onChange={(e) => setEditingNews({ ...editingNews, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isFeatured">À la une</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date de publication</Label>
              <Input
                type="date"
                value={editingNews.publishedAt ? editingNews.publishedAt.split("T")[0] : ""}
                onChange={(e) => setEditingNews({ ...editingNews, publishedAt: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewsDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleSaveNews}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Album Dialog */}
      <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
        <DialogContent className="glass-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingAlbum.id ? "Modifier l'album" : "Nouvel album"}
            </DialogTitle>
            <DialogDescription>
              Créez un album photo pour la galerie du site public
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={editingAlbum.title || ""}
                onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                placeholder="Nom de l'album"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editingAlbum.description || ""}
                onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                placeholder="Description de l'album"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Image de couverture</Label>
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg bg-muted/50 overflow-hidden relative">
                  {editingAlbum.coverImage ? (
                    <Image src={editingAlbum.coverImage} alt="" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 m-auto text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    ref={albumCoverRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "album");
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => albumCoverRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Upload..." : "Télécharger"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="albumPublished"
                checked={editingAlbum.isPublished}
                onChange={(e) => setEditingAlbum({ ...editingAlbum, isPublished: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="albumPublished">Publié</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlbumDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleSaveAlbum}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
