"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Film,
  Search,
  Plus,
  MoreVertical,
  Clock,
  Calendar,
  Award,
  Edit,
  Trash2,
  Eye,
  Globe,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Mock films data
const filmsData = [
  {
    id: "1",
    title: "Le Réveil des Ancêtres",
    titleOriginal: "Awakening of the Ancestors",
    year: 2024,
    duration: 115,
    genre: "Drame",
    synopsis: "Un jeune homme retourne dans son village natal et découvre les secrets de ses ancêtres...",
    status: "published",
    awards: ["Étalon d'Or FESPACO 2024"],
    poster: "/images/films/reveil.jpg",
    views: 1250,
  },
  {
    id: "2",
    title: "Run",
    titleOriginal: "Run",
    year: 2024,
    duration: 98,
    genre: "Thriller",
    synopsis: "Une course contre la montre pour sauver ce qui compte le plus...",
    status: "published",
    awards: [],
    poster: "/images/films/run.jpg",
    views: 890,
  },
  {
    id: "3",
    title: "Bangui, où le fleuve nous mène",
    titleOriginal: "Bangui, where the river leads us",
    year: 2023,
    duration: 142,
    genre: "Documentaire",
    synopsis: "Un voyage poétique le long du fleuve Oubangui...",
    status: "published",
    awards: ["Sélection Officielle Cannes 2023"],
    poster: "/images/films/bangui.jpg",
    views: 2100,
  },
  {
    id: "4",
    title: "Les Oiseaux du Ciel",
    titleOriginal: "Birds of the Sky",
    year: 2024,
    duration: 105,
    genre: "Drame",
    synopsis: "L'histoire de deux sœurs séparées par la guerre...",
    status: "draft",
    awards: [],
    poster: "/images/films/birds.jpg",
    views: 0,
  },
  {
    id: "5",
    title: "Nuit d'Afrique",
    titleOriginal: "African Night",
    year: 2024,
    duration: 88,
    genre: "Comédie",
    synopsis: "Une soirée qui tourne mal de manière hilarante...",
    status: "published",
    awards: ["Prix du Public AMAA 2024"],
    poster: "/images/films/nuit.jpg",
    views: 1567,
  },
];

const genreColors: Record<string, string> = {
  Drame: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Thriller: "bg-red-500/10 text-red-400 border-red-500/20",
  Documentaire: "bg-green-500/10 text-green-400 border-green-500/20",
  Comédie: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Action: "bg-primary/10 text-primary border-primary/20",
};

const statusConfig = {
  published: { label: "Publié", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  draft: { label: "Brouillon", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
};

export default function FilmsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredFilms = filmsData.filter((film) => {
    const matchesSearch = 
      film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      film.titleOriginal.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = genreFilter === "all" || film.genre === genreFilter;
    const matchesStatus = statusFilter === "all" || film.status === statusFilter;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  const stats = {
    total: filmsData.length,
    published: filmsData.filter((f) => f.status === "published").length,
    draft: filmsData.filter((f) => f.status === "draft").length,
    totalViews: filmsData.reduce((acc, f) => acc + f.views, 0),
  };

  const genres = [...new Set(filmsData.map((f) => f.genre))];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total films", value: stats.total, icon: Film, color: "text-primary" },
          { label: "Publiés", value: stats.published, icon: Globe, color: "text-green-400" },
          { label: "Brouillons", value: stats.draft, icon: Edit, color: "text-yellow-400" },
          { label: "Vues totales", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-blue-400" },
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
              Catalogue de films
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un film
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    Ajouter un film
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations du nouveau film
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="film-title">Titre</Label>
                      <Input id="film-title" placeholder="Titre du film" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="film-title-original">Titre original</Label>
                      <Input id="film-title-original" placeholder="Original title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="film-year">Année</Label>
                      <Input id="film-year" type="number" placeholder="2025" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="film-duration">Durée (minutes)</Label>
                      <Input id="film-duration" type="number" placeholder="90" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="film-genre">Genre</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drame">Drame</SelectItem>
                          <SelectItem value="comedie">Comédie</SelectItem>
                          <SelectItem value="thriller">Thriller</SelectItem>
                          <SelectItem value="documentaire">Documentaire</SelectItem>
                          <SelectItem value="action">Action</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="film-synopsis">Synopsis</Label>
                    <Textarea id="film-synopsis" placeholder="Résumé du film..." className="min-h-[80px]" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => setIsAddDialogOpen(false)}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un film..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Films Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFilms.map((film, index) => {
              const status = statusConfig[film.status as keyof typeof statusConfig];
              const genreColor = genreColors[film.genre] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
              
              return (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="glass-card border-border/30 overflow-hidden hover:glow-orange transition-shadow">
                    {/* Poster */}
                    <div className="relative aspect-[2/3] bg-gradient-to-br from-primary/20 to-background">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-16 h-16 text-primary/30" />
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                      
                      {/* Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir la fiche
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Awards Badge */}
                      {film.awards.length > 0 && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                            <Award className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400 truncate">
                              {film.awards[0]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <CardContent className="p-4">
                      <h3 className="font-display text-lg tracking-wider text-foreground line-clamp-1">
                        {film.title}
                      </h3>
                      {film.titleOriginal !== film.title && (
                        <p className="text-xs text-muted-foreground italic line-clamp-1">
                          {film.titleOriginal}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className={genreColor}>
                          {film.genre}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {film.year}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {film.duration} min
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                        {film.synopsis}
                      </p>

                      {film.status === "published" && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {film.views.toLocaleString()} vues
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredFilms.length === 0 && (
            <div className="text-center py-12">
              <Film className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Aucun film trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
