"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Plus,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Folder,
  Upload,
  File,
  Image,
  FileSpreadsheet,
  FileVideo,
  Clock,
  HardDrive,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock documents data
const documentsData = [
  {
    id: "1",
    name: "Statuts de l'association",
    type: "pdf",
    category: "LEGAL",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    uploadedBy: "Admin",
  },
  {
    id: "2",
    name: "Rapport d'activités 2024",
    type: "pdf",
    category: "REPORT",
    size: "5.1 MB",
    uploadDate: "2024-12-20",
    uploadedBy: "Admin",
  },
  {
    id: "3",
    name: "Liste des membres 2025",
    type: "xlsx",
    category: "MEMBERS",
    size: "156 KB",
    uploadDate: "2025-01-05",
    uploadedBy: "Admin",
  },
  {
    id: "4",
    name: "Procès-verbal AG 2024",
    type: "pdf",
    category: "LEGAL",
    size: "890 KB",
    uploadDate: "2024-12-15",
    uploadedBy: "Admin",
  },
  {
    id: "5",
    name: "Logo AACI vectoriel",
    type: "svg",
    category: "MEDIA",
    size: "45 KB",
    uploadDate: "2024-06-10",
    uploadedBy: "Admin",
  },
  {
    id: "6",
    name: "Budget prévisionnel 2025",
    type: "xlsx",
    category: "FINANCE",
    size: "234 KB",
    uploadDate: "2024-12-28",
    uploadedBy: "Admin",
  },
  {
    id: "7",
    name: "Photos événement workshop",
    type: "zip",
    category: "MEDIA",
    size: "45.2 MB",
    uploadDate: "2025-01-08",
    uploadedBy: "Admin",
  },
  {
    id: "8",
    name: "Contrat type membre",
    type: "docx",
    category: "LEGAL",
    size: "78 KB",
    uploadDate: "2024-03-15",
    uploadedBy: "Admin",
  },
];

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileText,
  svg: Image,
  zip: Folder,
  mp4: FileVideo,
  default: File,
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  LEGAL: { label: "Juridique", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  REPORT: { label: "Rapports", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  MEMBERS: { label: "Membres", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  MEDIA: { label: "Médias", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  FINANCE: { label: "Finance", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const filteredDocuments = documentsData.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: documentsData.length,
    totalSize: "54.1 MB",
    categories: Object.keys(categoryConfig).length,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Documents", value: stats.total, icon: FileText, color: "text-primary" },
          { label: "Taille totale", value: stats.totalSize, icon: HardDrive, color: "text-blue-400" },
          { label: "Catégories", value: stats.categories, icon: Folder, color: "text-green-400" },
          { label: "Récents", value: "3", icon: Clock, color: "text-yellow-400" },
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
              Bibliothèque de documents
            </CardTitle>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Upload className="w-4 h-4 mr-2" />
                  Téléverser
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    Téléverser un document
                  </DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau document à la bibliothèque
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="doc-name">Nom du document</Label>
                    <Input id="doc-name" placeholder="Nom du fichier" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-category">Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LEGAL">Juridique</SelectItem>
                        <SelectItem value="REPORT">Rapports</SelectItem>
                        <SelectItem value="MEMBERS">Membres</SelectItem>
                        <SelectItem value="MEDIA">Médias</SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fichier</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Glissez-déposez ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        PDF, DOC, XLS, Images (max 50MB)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setIsUploadDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => setIsUploadDialogOpen(false)}>
                      Téléverser
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
                placeholder="Rechercher un document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-background/50">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {Object.entries(categoryConfig).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc, index) => {
              const Icon = typeIcons[doc.type] || typeIcons.default;
              const category = categoryConfig[doc.category];
              
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="glass-card border-border/30 hover:glow-orange transition-shadow overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-foreground line-clamp-1">
                              {doc.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.type.toUpperCase()} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Aperçu
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                        <Badge variant="outline" className={category.color}>
                          {category.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(doc.uploadDate)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Aucun document trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
