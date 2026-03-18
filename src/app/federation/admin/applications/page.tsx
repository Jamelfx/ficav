"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  FileText,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock applications data
const applicationsData = [
  {
    id: "1",
    associationName: "Association des Scénaristes de Côte d'Ivoire",
    shortName: "ASCI",
    category: "TECHNIQUE",
    email: "contact@asci.ci",
    phone: "+225 07 00 00 01",
    city: "Abidjan",
    address: "Plateau, Abidjan",
    presidentName: "Kouadio Yao",
    membersCount: 45,
    description: "Association regroupant les scénaristes professionnels de Côte d'Ivoire.",
    motivation: "Nous souhaitons rejoindre la FICAV pour bénéficier du réseau et des formations.",
    documents: ["Statuts", "Registre commerce", "Liste des membres"],
    status: "pending",
    submittedAt: "2025-01-10",
  },
  {
    id: "2",
    associationName: "Guilde des Monteurs Ivoiriens",
    shortName: "GMI",
    category: "TECHNIQUE",
    email: "contact@gmi.ci",
    phone: "+225 07 00 00 02",
    city: "Abidjan",
    address: "Cocody, Abidjan",
    presidentName: "Aminata Diallo",
    membersCount: 32,
    description: "Association des monteurs et monteuses de cinéma et d'audiovisuel.",
    motivation: "Pour une meilleure représentation de notre métier et des formations continues.",
    documents: ["Statuts", "Registre commerce", "Liste des membres", "PV Assemblée"],
    status: "pending",
    submittedAt: "2025-01-08",
  },
  {
    id: "3",
    associationName: "Collectif des Chef Opérateurs",
    shortName: "CCO",
    category: "TECHNIQUE",
    email: "contact@cco.ci",
    phone: "+225 07 00 00 03",
    city: "Abidjan",
    address: "Treichville, Abidjan",
    presidentName: "Jean-Baptiste Kouassi",
    membersCount: 28,
    description: "Regroupement des chefs opérateurs de l'image.",
    motivation: "Rejoindre la fédération pour participer à la structuration du secteur.",
    documents: ["Statuts", "Liste des membres"],
    status: "under_review",
    submittedAt: "2025-01-05",
  },
  {
    id: "4",
    associationName: "Association des Décorateurs",
    shortName: "ADD",
    category: "TECHNIQUE",
    email: "contact@add.ci",
    phone: "+225 07 00 00 04",
    city: "Abidjan",
    address: "Marcory, Abidjan",
    presidentName: "Marie Kouadio",
    membersCount: 20,
    description: "Association des décorateurs de cinéma.",
    motivation: "Intégrer le réseau FICAV pour plus de visibilité.",
    documents: ["Statuts", "Registre commerce"],
    status: "approved",
    submittedAt: "2024-12-20",
    reviewedAt: "2025-01-02",
    reviewedBy: "Secrétaire Général",
  },
  {
    id: "5",
    associationName: "Société des Costumiers",
    shortName: "SDC",
    category: "TECHNIQUE",
    email: "contact@sdc.ci",
    phone: "+225 07 00 00 05",
    city: "Abidjan",
    address: "Plateau, Abidjan",
    presidentName: "Fatou Koné",
    membersCount: 15,
    description: "Association des costumiers du cinéma ivoirien.",
    motivation: "Rejoindre la FICAV pour défendre notre profession.",
    documents: ["Statuts"],
    status: "rejected",
    submittedAt: "2024-12-15",
    reviewedAt: "2024-12-22",
    reviewedBy: "Président",
    rejectionReason: "Dossier incomplet - manque le registre de commerce et la liste des membres.",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  under_review: { label: "En révision", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  approved: { label: "Approuvée", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  rejected: { label: "Rejetée", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function ApplicationsPage() {
  const { user, canManageApplications } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<typeof applicationsData[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const filteredApplications = applicationsData.filter((app) => {
    const matchesSearch =
      app.associationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applicationsData.length,
    pending: applicationsData.filter((a) => a.status === "pending").length,
    underReview: applicationsData.filter((a) => a.status === "under_review").length,
    approved: applicationsData.filter((a) => a.status === "approved").length,
    rejected: applicationsData.filter((a) => a.status === "rejected").length,
  };

  const handleForwardToPresident = (appId: string) => {
    // In real app, this would send to president
    console.log("Forwarding application to President:", appId);
    alert("Candidature transmise au Président pour validation");
  };

  const handleApprove = (appId: string) => {
    // In real app, this would approve and create association
    console.log("Approving application:", appId);
    alert("Candidature approuvée - Identifiants envoyés à l'association");
    setIsDetailOpen(false);
  };

  const handleReject = (appId: string) => {
    // In real app, this would reject with reason
    console.log("Rejecting application:", appId, "Reason:", reviewNote);
    alert("Candidature rejetée");
    setIsDetailOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
          Gestion des candidatures
        </h1>
        <p className="text-muted-foreground">
          Traitez les demandes d'adhésion des associations à la Fédération
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, icon: FileText, color: "text-muted-foreground" },
          { label: "En attente", value: stats.pending, icon: Clock, color: "text-yellow-400" },
          { label: "En révision", value: stats.underReview, icon: Eye, color: "text-blue-400" },
          { label: "Approuvées", value: stats.approved, icon: CheckCircle2, color: "text-green-400" },
          { label: "Rejetées", value: stats.rejected, icon: XCircle, color: "text-red-400" },
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
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="glass-card border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une candidature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-background/50">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="under_review">En révision</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app, index) => {
          const status = statusConfig[app.status];
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-border/30 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-foreground">
                            {app.associationName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {app.shortName}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Président: {app.presidentName} • {app.membersCount} membres
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Soumis le {app.submittedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(app);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      {canManageApplications && app.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleForwardToPresident(app.id)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Transmettre au Président
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Détails de la candidature
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.associationName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6 mt-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={statusConfig[selectedApplication.status].color}
                >
                  {statusConfig[selectedApplication.status].label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Soumis le {selectedApplication.submittedAt}
                </span>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Informations</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="review">Révision</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Nom complet</p>
                      <p className="font-medium">{selectedApplication.associationName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sigle</p>
                      <p className="font-medium">{selectedApplication.shortName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Catégorie</p>
                      <p className="font-medium">{selectedApplication.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Nombre de membres</p>
                      <p className="font-medium">{selectedApplication.membersCount}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {selectedApplication.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {selectedApplication.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {selectedApplication.address}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{selectedApplication.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Motivation</p>
                    <p className="text-sm">{selectedApplication.motivation}</p>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    {selectedApplication.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="review" className="space-y-4 mt-4">
                  {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-400">
                        <strong>Raison du rejet:</strong> {selectedApplication.rejectionReason}
                      </p>
                    </div>
                  )}
                  
                  {selectedApplication.status === "approved" && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-sm text-green-400">
                        Approuvée le {selectedApplication.reviewedAt} par {selectedApplication.reviewedBy}
                      </p>
                    </div>
                  )}

                  {canManageApplications && (selectedApplication.status === "pending" || selectedApplication.status === "under_review") && (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Note de révision</p>
                        <Textarea
                          placeholder="Ajoutez vos observations..."
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        {user?.role === "SECRETAIRE_GENERAL" && selectedApplication.status === "pending" && (
                          <Button
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={() => handleForwardToPresident(selectedApplication.id)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Transmettre au Président
                          </Button>
                        )}
                        {user?.role === "PRESIDENT" && (
                          <>
                            <Button
                              variant="outline"
                              className="flex-1 text-red-400 border-red-400/30 hover:bg-red-400/10"
                              onClick={() => handleReject(selectedApplication.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Rejeter
                            </Button>
                            <Button
                              className="flex-1 bg-green-500 hover:bg-green-500/90"
                              onClick={() => handleApprove(selectedApplication.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Approuver
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
