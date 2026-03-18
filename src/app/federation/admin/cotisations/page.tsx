"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Search,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  Mail,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Bell,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";

// Mock cotisations data
const cotisationsData = [
  {
    id: "1",
    associationId: "1",
    associationName: "Association des Acteurs de Côte d'Ivoire",
    shortName: "AACI",
    year: 2025,
    amount: 150000,
    status: "paid",
    paidAt: "2025-01-15",
    paymentMethod: "Virement bancaire",
    reference: "VIR-2025-001",
  },
  {
    id: "2",
    associationId: "2",
    associationName: "Association des Réalisateurs de Côte d'Ivoire",
    shortName: "ARCI",
    year: 2025,
    amount: 150000,
    status: "pending",
    dueDate: "2025-01-31",
    reminderSent: false,
  },
  {
    id: "3",
    associationId: "3",
    associationName: "Association des Producteurs de Côte d'Ivoire",
    shortName: "APCI",
    year: 2025,
    amount: 150000,
    status: "overdue",
    dueDate: "2024-12-31",
    reminderSent: true,
    lastReminderAt: "2025-01-05",
  },
  {
    id: "4",
    associationId: "4",
    associationName: "Association des Scénaristes de Côte d'Ivoire",
    shortName: "ASCI",
    year: 2025,
    amount: 150000,
    status: "paid",
    paidAt: "2025-01-10",
    paymentMethod: "Mobile Money",
    reference: "MM-2025-045",
  },
  {
    id: "5",
    associationId: "5",
    associationName: "Association des Techniciens de Côte d'Ivoire",
    shortName: "ATCI",
    year: 2025,
    amount: 150000,
    status: "pending",
    dueDate: "2025-02-15",
    reminderSent: false,
  },
  {
    id: "6",
    associationId: "6",
    associationName: "Association des Distributeurs de Côte d'Ivoire",
    shortName: "ADCI",
    year: 2025,
    amount: 150000,
    status: "overdue",
    dueDate: "2024-12-31",
    reminderSent: true,
    lastReminderAt: "2025-01-08",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Payée", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  pending: { label: "En attente", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  overdue: { label: "En retard", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function CotisationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCotisation, setSelectedCotisation] = useState<typeof cotisationsData[0] | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  const filteredCotisations = cotisationsData.filter((cot) => {
    const matchesSearch =
      cot.associationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cot.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: cotisationsData.length,
    paid: cotisationsData.filter((c) => c.status === "paid").length,
    pending: cotisationsData.filter((c) => c.status === "pending").length,
    overdue: cotisationsData.filter((c) => c.status === "overdue").length,
    totalCollected: cotisationsData
      .filter((c) => c.status === "paid")
      .reduce((acc, c) => acc + c.amount, 0),
    totalPending: cotisationsData
      .filter((c) => c.status !== "paid")
      .reduce((acc, c) => acc + c.amount, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSendReminder = () => {
    console.log("Sending reminder to:", selectedCotisation?.associationName, "Message:", reminderMessage);
    alert(`Rappel envoyé à ${selectedCotisation?.associationName}`);
    setIsReminderOpen(false);
    setReminderMessage("");
  };

  const handleMarkAsPaid = (cotisationId: string) => {
    console.log("Marking as paid:", cotisationId);
    alert("Cotisation marquée comme payée");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
          Gestion des cotisations
        </h1>
        <p className="text-muted-foreground">
          Suivez et gérez les cotisations des associations membres
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total collecté",
            value: formatCurrency(stats.totalCollected),
            icon: CheckCircle2,
            color: "text-green-400",
          },
          {
            label: "En attente",
            value: formatCurrency(stats.totalPending),
            icon: Clock,
            color: "text-yellow-400",
          },
          {
            label: "Payées",
            value: stats.paid,
            icon: DollarSign,
            color: "text-blue-400",
          },
          {
            label: "En retard",
            value: stats.overdue,
            icon: AlertTriangle,
            color: "text-red-400",
          },
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

      {/* Quick Actions */}
      <Card className="glass-card border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter les relevés
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Générer les factures {new Date().getFullYear()}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="glass-card border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une association..."
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
                <SelectItem value="paid">Payées</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cotisations List */}
      <div className="space-y-4">
        {filteredCotisations.map((cot, index) => {
          const status = statusConfig[cot.status];
          return (
            <motion.div
              key={cot.id}
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
                            {cot.associationName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {cot.shortName}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cotisation {cot.year} • {formatCurrency(cot.amount)}
                        </p>
                        {cot.status === "paid" && (
                          <p className="text-xs text-green-400 mt-1">
                            Payé le {cot.paidAt} via {cot.paymentMethod}
                          </p>
                        )}
                        {cot.status === "pending" && (
                          <p className="text-xs text-yellow-400 mt-1">
                            Échéance: {cot.dueDate}
                          </p>
                        )}
                        {cot.status === "overdue" && (
                          <p className="text-xs text-red-400 mt-1">
                            En retard depuis le {cot.dueDate}
                            {cot.reminderSent && ` • Dernier rappel: ${cot.lastReminderAt}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                      {cot.status !== "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCotisation(cot);
                            setReminderMessage(
                              `Chers membres de ${cot.associationName},\n\nNous vous rappelons que votre cotisation annuelle de ${formatCurrency(cot.amount)} pour l'année ${cot.year} n'a pas encore été réglée.\n\nNous vous prions de bien vouloir régulariser votre situation.\n\nCordialement,\nLa Trésorière FICAV`
                            );
                            setIsReminderOpen(true);
                          }}
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          Rappel
                        </Button>
                      )}
                      {cot.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-500/90"
                          onClick={() => handleMarkAsPaid(cot.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Marquer payée
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

      {/* Reminder Dialog */}
      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent className="glass-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Envoyer un rappel
            </DialogTitle>
            <DialogDescription>
              {selectedCotisation?.associationName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-sm text-muted-foreground">Montant dû</Label>
              <p className="font-bold text-lg">
                {selectedCotisation && formatCurrency(selectedCotisation.amount)}
              </p>
            </div>
            
            <div>
              <Label htmlFor="message">Message de rappel</Label>
              <Textarea
                id="message"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="min-h-[200px] mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsReminderOpen(false)}>
                Annuler
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSendReminder}>
                <Send className="w-4 h-4 mr-2" />
                Envoyer le rappel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
