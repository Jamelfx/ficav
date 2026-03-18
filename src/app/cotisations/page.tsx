"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CreditCard, DollarSign, Clock, AlertTriangle, 
  CheckCircle, Loader2, Eye, Bell, Download,
  Calendar, Building2, Filter, Lock
} from "lucide-react";
import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, COTISATION_MANAGERS } from "@/lib/auth-context";

interface Cotisation {
  id: string;
  year: number;
  amount: number;
  dueDate: string;
  status: string;
  paidAt: string | null;
  paymentMethod: string | null;
  transactionId: string | null;
  receiptUrl: string | null;
  association: {
    id: string;
    name: string;
    logo: string | null;
  };
  payments: Array<{
    id: string;
    amount: number;
    paidAt: string;
    method: string;
    transactionId: string | null;
    receiptUrl: string | null;
  }>;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PAID: { 
    label: "Payé", 
    color: "bg-green-500/20 text-green-400 border-green-500/30", 
    icon: <CheckCircle className="w-3 h-3" /> 
  },
  PENDING: { 
    label: "En attente", 
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
    icon: <Clock className="w-3 h-3" /> 
  },
  OVERDUE: { 
    label: "En retard", 
    color: "bg-red-500/20 text-red-400 border-red-500/30", 
    icon: <AlertTriangle className="w-3 h-3" /> 
  },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function CotisationsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Check if user has access
  const hasAccess = isAuthenticated && user && COTISATION_MANAGERS.includes(user.role);

  const fetchCotisations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (yearFilter !== "all") params.append("year", yearFilter);

      const response = await fetch(`/api/cotisations?${params.toString()}`);
      const data = await response.json();
      setCotisations(data);
    } catch (error) {
      console.error("Error fetching cotisations:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, yearFilter]);

  useEffect(() => {
    if (hasAccess) {
      fetchCotisations();
    } else {
      setLoading(false);
    }
  }, [hasAccess, fetchCotisations]);

  // Calculate statistics
  const stats = {
    total: cotisations.reduce((sum, c) => sum + c.amount, 0),
    collected: cotisations
      .filter(c => c.status === 'PAID')
      .reduce((sum, c) => sum + c.amount, 0),
    pending: cotisations
      .filter(c => c.status === 'PENDING')
      .reduce((sum, c) => sum + c.amount, 0),
    overdue: cotisations
      .filter(c => c.status === 'OVERDUE')
      .reduce((sum, c) => sum + c.amount, 0),
    paidCount: cotisations.filter(c => c.status === 'PAID').length,
    pendingCount: cotisations.filter(c => c.status === 'PENDING').length,
    overdueCount: cotisations.filter(c => c.status === 'OVERDUE').length,
  };

  // Get unique years for filter
  const years = [...new Set(cotisations.map(c => c.year))].sort((a, b) => b - a);

  // Access Denied View
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-cinema">
        <Navigation />
        
        <main className="flex-1 pt-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              Accès Restreint
            </h1>
            <p className="text-muted-foreground mb-6">
              Cette section est réservée aux membres du Bureau Fédéral :
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="outline" className="border-primary/30 text-primary">
                Président
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Secrétaire Général
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Trésorière
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Directeur de la Communication
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Connectez-vous avec un compte autorisé pour accéder à cette page.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-primary hover:bg-primary/90"
            >
              Retour à l&apos;accueil
            </Button>
          </motion.div>
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
                <CreditCard className="w-3 h-3 mr-1" />
                Gestion des Cotisations
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
                Cotisations des Associations
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Suivez et gérez les cotisations annuelles des associations membres de la FICAV.
              </p>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <Card className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Cotisations
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(stats.total)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cotisations.length} cotisation{cotisations.length > 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Encaissé
                  </CardTitle>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(stats.collected)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.paidCount} paiement{stats.paidCount > 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    En attente
                  </CardTitle>
                  <Clock className="w-4 h-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatCurrency(stats.pending)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.pendingCount} en attente
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    En retard
                  </CardTitle>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {formatCurrency(stats.overdue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.overdueCount} en retard
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card rounded-2xl p-6 mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filtres:</span>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="PAID">Payé</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="OVERDUE">En retard</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="all">Toutes les années</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Cotisations Table */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                          Association
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                          Année
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                          Montant dû
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                          Date de paiement
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {cotisations.map((cotisation) => {
                        const status = statusConfig[cotisation.status] || statusConfig.PENDING;
                        
                        return (
                          <tr 
                            key={cotisation.id}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {cotisation.association.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ID: {cotisation.id.slice(0, 8)}...
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-foreground">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {cotisation.year}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-foreground">
                                {formatCurrency(cotisation.amount)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={status.color}>
                                {status.icon}
                                <span className="ml-1">{status.label}</span>
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {cotisation.paidAt ? (
                                <div>
                                  <p>{formatDate(cotisation.paidAt)}</p>
                                  {cotisation.paymentMethod && (
                                    <p className="text-xs text-muted-foreground/70">
                                      via {cotisation.paymentMethod}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground/50">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {cotisation.status === 'PAID' && cotisation.receiptUrl && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                                {(cotisation.status === 'PENDING' || cotisation.status === 'OVERDUE') && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                                  >
                                    <Bell className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-primary hover:text-primary hover:bg-primary/10"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {cotisations.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Aucune cotisation trouvée
                    </h3>
                    <p className="text-muted-foreground">
                      Les cotisations des associations membres apparaîtront ici.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
