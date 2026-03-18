"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, FileText, Download, Filter, X, Loader2,
  File, FileImage, FileSpreadsheet, FolderOpen
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string;
  fileType: string | null;
  fileSize: number | null;
  association: {
    name: string;
    logo: string | null;
  } | null;
  createdAt: string;
}

const categoryLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  statuts: { label: "Statuts", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <FileText className="w-3 h-3" /> },
  reglements: { label: "Règlements", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: <FileText className="w-3 h-3" /> },
  pv: { label: "Procès-verbaux", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: <File className="w-3 h-3" /> },
  conventions: { label: "Conventions", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: <FileText className="w-3 h-3" /> },
  rapports: { label: "Rapports", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: <FileImage className="w-3 h-3" /> },
  etudes: { label: "Études", color: "bg-pink-500/20 text-pink-400 border-pink-500/30", icon: <FileSpreadsheet className="w-3 h-3" /> },
};

const getFileIcon = (fileType: string | null) => {
  if (!fileType) return <File className="w-6 h-6" />;
  if (fileType.includes('pdf')) return <FileText className="w-6 h-6 text-red-400" />;
  if (fileType.includes('image')) return <FileImage className="w-6 h-6 text-green-400" />;
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-6 h-6 text-emerald-400" />;
  return <File className="w-6 h-6" />;
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (search) params.append("search", search);

      const response = await fetch(`/api/documents?${params.toString()}`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, search]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDownload = (doc: Document) => {
    // In a real app, this would trigger an actual download
    // For now, we'll show a simulated download
    const link = window.document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.title;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
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
                <FolderOpen className="w-3 h-3 mr-1" />
                Centre de Documentation
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
                Bibliothèque de Documents
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Accédez aux documents officiels de la FICAV : statuts, règlements, 
                procès-verbaux, conventions, rapports et études.
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
                    placeholder="Rechercher un document..."
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
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-56 h-12 bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="statuts">Statuts</SelectItem>
                      <SelectItem value="reglements">Règlements</SelectItem>
                      <SelectItem value="pv">Procès-verbaux</SelectItem>
                      <SelectItem value="conventions">Conventions</SelectItem>
                      <SelectItem value="rapports">Rapports</SelectItem>
                      <SelectItem value="etudes">Études</SelectItem>
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
                    <div className="pt-4 mt-4 border-t border-border/50">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full h-12 bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          <SelectItem value="statuts">Statuts</SelectItem>
                          <SelectItem value="reglements">Règlements</SelectItem>
                          <SelectItem value="pv">Procès-verbaux</SelectItem>
                          <SelectItem value="conventions">Conventions</SelectItem>
                          <SelectItem value="rapports">Rapports</SelectItem>
                          <SelectItem value="etudes">Études</SelectItem>
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
                  <>{documents.length} document{documents.length > 1 ? "s" : ""} trouvé{documents.length > 1 ? "s" : ""}</>
                )}
              </p>
              
              {(categoryFilter !== "all" || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategoryFilter("all");
                    setSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>

            {/* Documents Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : documents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <FolderOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucun document trouvé
                </h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc, index) => {
                  const categoryInfo = categoryLabels[doc.category] || { 
                    label: doc.category, 
                    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
                    icon: <File className="w-3 h-3" />
                  };
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div 
                        className="glass-card rounded-xl p-6 h-full hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <Badge className={categoryInfo.color}>
                            {categoryInfo.icon}
                            <span className="ml-1">{categoryInfo.label}</span>
                          </Badge>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            {getFileIcon(doc.fileType)}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>

                        {/* Description */}
                        {doc.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {doc.description}
                          </p>
                        )}

                        {/* File Info */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span>{formatDate(doc.createdAt)}</span>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-border/30">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {doc.association?.name || "FICAV"}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-primary hover:text-primary hover:bg-primary/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(doc);
                              }}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Télécharger
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Document Preview Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedDocument.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={categoryLabels[selectedDocument.category]?.color || "bg-gray-500/20 text-gray-400 border-gray-500/30"}>
                    {categoryLabels[selectedDocument.category]?.label || selectedDocument.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(selectedDocument.fileSize)}
                  </span>
                </div>

                {selectedDocument.description && (
                  <p className="text-muted-foreground">
                    {selectedDocument.description}
                  </p>
                )}

                <div className="glass-card rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date de publication</span>
                    <span className="text-foreground">{formatDate(selectedDocument.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Source</span>
                    <span className="text-foreground">{selectedDocument.association?.name || "FICAV"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type de fichier</span>
                    <span className="text-foreground">{selectedDocument.fileType?.split('/')[1]?.toUpperCase() || 'PDF'}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleDownload(selectedDocument)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le document
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
