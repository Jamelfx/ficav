"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MapPin, Clock, Briefcase, ArrowLeft, Share2, 
  Laptop, Mail, Phone, Calendar, CheckCircle,
  AlertCircle, Building2, Copy
} from "lucide-react";
import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

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
  createdAt: string;
  association: {
    id: string;
    name: string;
    logo: string | null;
    slug: string;
  };
}

const jobTypeLabels: Record<string, { label: string; color: string }> = {
  EMPLOI: { label: "Emploi", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  CASTING: { label: "Casting", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  APPEL_PROJET: { label: "Appel à projets", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  STAGE: { label: "Stage", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  FORMATION: { label: "Formation", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function OfferDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${slug}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [slug]);

  // Countdown timer
  useEffect(() => {
    if (!job?.deadline) return;

    const calculateCountdown = () => {
      const deadlineDate = new Date(job.deadline!);
      const now = new Date();
      const diff = deadlineDate.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isExpired: false };
    };

    setCountdown(calculateCountdown());
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, [job?.deadline]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title || "Offre FICAV",
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié dans le presse-papiers");
    }
  };

  const handleApply = () => {
    if (job?.contactEmail) {
      const subject = encodeURIComponent(`Candidature: ${job.title}`);
      const body = encodeURIComponent(`Bonjour,\n\nJe vous adresse ma candidature pour l'offre "${job.title}".\n\nCordialement.`);
      window.location.href = `mailto:${job.contactEmail}?subject=${subject}&body=${body}`;
    }
  };

  const getRequirements = (): string[] => {
    if (!job?.requirements) return [];
    try {
      return JSON.parse(job.requirements);
    } catch {
      return job.requirements.split('\n').filter(Boolean);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const typeInfo = job ? (jobTypeLabels[job.type] || { label: job.type, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" }) : { label: "", color: "" };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-cinema">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-96 h-24 bg-secondary/50 rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-cinema">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Offre non trouvée</h1>
            <p className="text-muted-foreground mb-6">
              Cette offre n'existe pas ou a été supprimée.
            </p>
            <Link href="/offres">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux offres
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-cinema">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Link href="/offres">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux offres
                </Button>
              </Link>
            </motion.div>

            {/* Main Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className={typeInfo.color}>
                    {typeInfo.label}
                  </Badge>
                  {job.isFilled && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      Poste pourvu
                    </Badge>
                  )}
                  {job.isRemote && (
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      <Laptop className="w-3 h-3 mr-1" />
                      Télétravail
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 font-display">
                  {job.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                  {job.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.association && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>{job.association.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Publié le {formatDate(job.createdAt)}</span>
                  </div>
                </div>

                {/* Salary */}
                {job.salary && (
                  <div className="mb-6">
                    <span className="text-xl font-bold text-primary">{job.salary}</span>
                  </div>
                )}

                {/* Countdown Timer */}
                {job.deadline && countdown && (
                  <div className={`rounded-xl p-4 mb-6 ${countdown.isExpired ? "bg-red-500/10 border border-red-500/20" : "bg-primary/10 border border-primary/20"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className={`w-5 h-5 ${countdown.isExpired ? "text-red-400" : "text-primary"}`} />
                      <span className={`font-semibold ${countdown.isExpired ? "text-red-400" : "text-foreground"}`}>
                        {countdown.isExpired ? "Date limite dépassée" : "Date limite dans"}
                      </span>
                    </div>
                    {!countdown.isExpired && (
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary tabular-nums">{countdown.days}</div>
                          <div className="text-xs text-muted-foreground uppercase">Jours</div>
                        </div>
                        <div className="text-2xl text-muted-foreground">:</div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary tabular-nums">
                            {String(countdown.hours).padStart(2, '0')}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase">Heures</div>
                        </div>
                        <div className="text-2xl text-muted-foreground">:</div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary tabular-nums">
                            {String(countdown.minutes).padStart(2, '0')}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase">Minutes</div>
                        </div>
                        <div className="text-2xl text-muted-foreground">:</div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary tabular-nums">
                            {String(countdown.seconds).padStart(2, '0')}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase">Secondes</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {!countdown?.isExpired && !job.isFilled && job.contactEmail && (
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange"
                      onClick={handleApply}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Postuler
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-border/50"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Description */}
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Description
                </h2>
                <div className="prose prose-invert max-w-none text-muted-foreground">
                  {job.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {getRequirements().length > 0 && (
                <>
                  <Separator className="bg-border/30" />
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Prérequis
                    </h2>
                    <ul className="space-y-3">
                      {getRequirements().map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Contact */}
              {(job.contactEmail || job.contactPhone) && (
                <>
                  <Separator className="bg-border/30" />
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Contact
                    </h2>
                    <div className="flex flex-wrap gap-6">
                      {job.contactEmail && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <a 
                              href={`mailto:${job.contactEmail}`}
                              className="text-foreground hover:text-primary transition-colors"
                            >
                              {job.contactEmail}
                            </a>
                          </div>
                        </div>
                      )}
                      {job.contactPhone && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <a 
                              href={`tel:${job.contactPhone}`}
                              className="text-foreground hover:text-primary transition-colors"
                            >
                              {job.contactPhone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
