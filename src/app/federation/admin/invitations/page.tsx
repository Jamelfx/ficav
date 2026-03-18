"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Copy,
  RefreshCw,
  Building2,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Invitation = {
  id: string;
  associationName: string;
  associationShortName: string;
  email: string;
  membershipFee: number;
  firstCotisation: number | null;
  requirePayment: boolean;
  isPaid: boolean;
  isAccepted: boolean;
  invitationToken: string;
  sentAt: string;
  paidAt: string | null;
  acceptedAt: string | null;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(amount) + " FCFA";
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ADHESION_AMOUNT = 50000;

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPaymentRequired, setShowPaymentRequired] = useState(true);

  // New invitation form
  const [associationName, setAssociationName] = useState("");
  const [associationShortName, setAssociationShortName] = useState("");
  const [email, setEmail] = useState("");
  const [membershipFee, setMembershipFee] = useState(ADHESION_AMOUNT.toString());
  const [firstCotisation, setFirstCotisation] = useState("");

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/association/invitations");
      const data = await response.json();
      setInvitations(Array.isArray(data.invitations) ? data.invitations : []);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      // Set mock data for demo
      setInvitations([
        {
          id: "1",
          associationName: "Association des Réalisateurs de Côte d'Ivoire",
          associationShortName: "ARCI",
          email: "contact@arci.ci",
          membershipFee: 50000,
          firstCotisation: null,
          requirePayment: true,
          isPaid: false,
          isAccepted: false,
          invitationToken: "demo-token-1",
          sentAt: new Date().toISOString(),
          paidAt: null,
          acceptedAt: null,
        },
        {
          id: "2",
          associationName: "Union des Producteurs Ivoiriens",
          associationShortName: "UPI",
          email: "info@upi.ci",
          membershipFee: 50000,
          firstCotisation: 100000,
          requirePayment: true,
          isPaid: true,
          isAccepted: true,
          invitationToken: "demo-token-2",
          sentAt: new Date(Date.now() - 86400000).toISOString(),
          paidAt: new Date(Date.now() - 43200000).toISOString(),
          acceptedAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!associationName || !associationShortName || !email) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/association/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          associationName,
          associationShortName,
          email,
          membershipFee: parseFloat(membershipFee) || ADHESION_AMOUNT,
          firstCotisation: firstCotisation ? parseFloat(firstCotisation) : null,
          requirePayment: showPaymentRequired,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Invitation envoyée avec succès!");
        setShowNewDialog(false);
        resetForm();
        fetchInvitations();

        // Copy link to clipboard
        if (data.invitation?.invitationUrl) {
          navigator.clipboard.writeText(data.invitation.invitationUrl);
          toast.info("Lien d'invitation copié dans le presse-papier");
        }
      } else {
        toast.error(data.error || "Erreur lors de l'envoi de l'invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Erreur lors de l'envoi de l'invitation");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette invitation ?")) return;

    try {
      const response = await fetch(`/api/association/invitations?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Invitation annulée");
        fetchInvitations();
      } else {
        toast.error("Erreur lors de l'annulation");
      }
    } catch (error) {
      console.error("Error deleting invitation:", error);
      toast.error("Erreur lors de l'annulation");
    }
  };

  const copyInvitationLink = (token: string) => {
    const url = `${window.location.origin}/invitation/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié dans le presse-papier");
  };

  const resetForm = () => {
    setAssociationName("");
    setAssociationShortName("");
    setEmail("");
    setMembershipFee(ADHESION_AMOUNT.toString());
    setFirstCotisation("");
    setShowPaymentRequired(true);
  };

  const stats = {
    total: invitations.length,
    pending: invitations.filter(i => !i.isAccepted).length,
    paid: invitations.filter(i => i.isPaid).length,
    accepted: invitations.filter(i => i.isAccepted).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
            Gestion des Invitations
          </h1>
          <p className="text-muted-foreground">
            Envoyez des invitations aux associations pour rejoindre la FICAV
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowNewDialog(true)}
        >
          <Send className="w-4 h-4 mr-2" />
          Nouvelle invitation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total invitations", value: stats.total, icon: Mail, color: "text-primary" },
          { label: "En attente", value: stats.pending, icon: Clock, color: "text-yellow-400" },
          { label: "Payées", value: stats.paid, icon: CheckCircle2, color: "text-green-400" },
          { label: "Acceptées", value: stats.accepted, icon: CheckCircle2, color: "text-primary" },
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
                    <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <Card className="glass-card border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary">Processus d&apos;adhésion</p>
              <p className="text-muted-foreground mt-1">
                L&apos;association recevra un email avec un lien d&apos;invitation. 
                Elle devra payer son adhésion ({formatCurrency(ADHESION_AMOUNT)}) avant de pouvoir créer son compte 
                et accéder à son espace membre.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg">Liste des invitations</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchInvitations}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune invitation envoyée</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowNewDialog(true)}
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer une première invitation
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">Association</TableHead>
                    <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Montant</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Statut</TableHead>
                    <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Date</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation, index) => (
                    <motion.tr
                      key={invitation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-white/5"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{invitation.associationShortName}</p>
                            <p className="text-xs text-muted-foreground">{invitation.associationName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{invitation.email}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="font-medium">{formatCurrency(invitation.membershipFee)}</span>
                        {invitation.firstCotisation && (
                          <p className="text-xs text-muted-foreground">
                            + {formatCurrency(invitation.firstCotisation)} cotisation
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {invitation.isAccepted ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Acceptée
                            </Badge>
                          ) : invitation.isPaid ? (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              <DollarSign className="w-3 h-3 mr-1" />
                              Payée
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Clock className="w-3 h-3 mr-1" />
                              En attente
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(invitation.sentAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => copyInvitationLink(invitation.invitationToken)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          {!invitation.isAccepted && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-destructive"
                              onClick={() => handleDeleteInvitation(invitation.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Invitation Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="glass-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Nouvelle invitation</DialogTitle>
            <DialogDescription>
              Envoyez une invitation à une association pour rejoindre la FICAV
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asso-name">Nom de l&apos;association *</Label>
                <Input
                  id="asso-name"
                  value={associationName}
                  onChange={(e) => setAssociationName(e.target.value)}
                  placeholder="Association des Cinéastes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asso-short">Sigle *</Label>
                <Input
                  id="asso-short"
                  value={associationShortName}
                  onChange={(e) => setAssociationShortName(e.target.value.toUpperCase())}
                  placeholder="ACI"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email de contact *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@association.ci"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="membership-fee">Frais d&apos;adhésion</Label>
                <Input
                  id="membership-fee"
                  type="number"
                  value={membershipFee}
                  onChange={(e) => setMembershipFee(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first-cotisation">1ère cotisation (optionnel)</Label>
                <Input
                  id="first-cotisation"
                  type="number"
                  value={firstCotisation}
                  onChange={(e) => setFirstCotisation(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <Label className="font-medium">Paiement obligatoire</Label>
                <p className="text-sm text-muted-foreground">
                  L&apos;association doit payer avant de créer son compte
                </p>
              </div>
              <Switch
                checked={showPaymentRequired}
                onCheckedChange={setShowPaymentRequired}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Annuler
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleSendInvitation}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer l&apos;invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
