"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Clock, MapPin, Mail, Phone, CheckCircle, XCircle,
  Loader2, Eye, X, Calendar, DollarSign, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface JobOffer {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: string;
  location: string | null;
  isRemote: boolean;
  salary: string | null;
  deadline: string | null;
  requirements: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: string;
  createdAt: string;
  association: {
    name: string;
    logo: string | null;
  } | null;
}

const jobTypeLabels: Record<string, string> = {
  EMPLOI: "Offre d'emploi",
  CASTING: "Casting",
  APPEL_PROJET: "Appel à projets",
  STAGE: "Stage",
  FORMATION: "Formation",
};

const jobTypeColors: Record<string, string> = {
  EMPLOI: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CASTING: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  APPEL_PROJET: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  STAGE: "bg-green-500/20 text-green-400 border-green-500/30",
  FORMATION: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function JobOffersPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs?forValidation=true");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleValidate = async (jobSlug: string, action: "approve" | "reject") => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/jobs/${jobSlug}/validate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
          validatedBy: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la validation");
      }

      toast.success(
        action === "approve" ? "Offre approuvée" : "Offre refusée",
        {
          description: action === "approve"
            ? "L'offre a été publiée avec succès."
            : "L'offre a été refusée.",
        }
      );

      // Refresh the list
      fetchJobs();
      setShowDetails(false);
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedJob(null);
    } catch (error) {
      console.error("Error validating job:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la validation.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const parseRequirements = (requirements: string | null) => {
    if (!requirements) return [];
    try {
      return JSON.parse(requirements);
    } catch {
      return requirements.split("\n").filter((r) => r.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">
            Offres à valider
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les offres d&apos;emploi, castings et appels à projets soumis par les associations
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {jobs.length} en attente
        </Badge>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Aucune offre en attente
          </h3>
          <p className="text-muted-foreground">
            Toutes les offres ont été traitées. Les nouvelles soumissions apparaîtront ici.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Badge className={jobTypeColors[job.type] || "bg-gray-500/20 text-gray-400"}>
                        {jobTypeLabels[job.type] || job.type}
                      </Badge>
                      <Badge variant="outline" className="border-yellow-500/30 text-yellow-500">
                        <Clock className="w-3 h-3 mr-1" />
                        En attente
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      {job.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Avant le {formatDate(job.deadline)}</span>
                        </div>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {job.description}
                      </p>
                    )}

                    {job.association && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span>Soumis par <strong className="text-foreground">{job.association.name}</strong></span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>le {formatDate(job.createdAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2 lg:w-48">
                    <Button
                      variant="outline"
                      className="flex-1 lg:flex-none"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Détails
                    </Button>
                    <Button
                      className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                      onClick={() => handleValidate(job.slug, "approve")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approuver
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 lg:flex-none"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Refuser
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  {selectedJob.title}
                </DialogTitle>
                <DialogDescription>
                  Soumis par {selectedJob.association?.name || "Association inconnue"} le {formatDate(selectedJob.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Type & Status */}
                <div className="flex items-center gap-2">
                  <Badge className={jobTypeColors[selectedJob.type] || "bg-gray-500/20 text-gray-400"}>
                    {jobTypeLabels[selectedJob.type] || selectedJob.type}
                  </Badge>
                  {selectedJob.isRemote && (
                    <Badge variant="outline">Télétravail possible</Badge>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedJob.description || "Aucune description"}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedJob.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Lieu</p>
                        <p className="text-sm text-muted-foreground">{selectedJob.location}</p>
                      </div>
                    </div>
                  )}
                  {selectedJob.salary && (
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Rémunération</p>
                        <p className="text-sm text-muted-foreground">{selectedJob.salary}</p>
                      </div>
                    </div>
                  )}
                  {selectedJob.deadline && (
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Date limite</p>
                        <p className="text-sm text-muted-foreground">{formatDate(selectedJob.deadline)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {selectedJob.requirements && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Exigences / Qualifications</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {parseRequirements(selectedJob.requirements).map((req: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Contact</h4>
                  <div className="flex flex-wrap gap-4">
                    {selectedJob.contactEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{selectedJob.contactEmail}</span>
                      </div>
                    )}
                    {selectedJob.contactPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{selectedJob.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Fermer
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetails(false);
                    setShowRejectDialog(true);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Refuser
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const slug = selectedJob.slug;
                    setShowDetails(false);
                    handleValidate(slug, "approve");
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approuver
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser l&apos;offre</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du refus. Cette information sera transmise à l&apos;association.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="Ex: L'offre ne correspond pas aux critères de publication..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason("");
            }}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedJob && handleValidate(selectedJob.slug, "reject")}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Confirmer le refus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
