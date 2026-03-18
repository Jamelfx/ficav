"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, CreditCard, Building2, Calendar, Clock, 
  CheckCircle, AlertTriangle, Download, Loader2,
  Receipt, Phone, Mail, MapPin, Wallet, Smartphone,
  CreditCard as CardIcon
} from "lucide-react";
import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Payment {
  id: string;
  amount: number;
  paidAt: string;
  method: string;
  transactionId: string | null;
  receiptUrl: string | null;
}

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
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  payments: Payment[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PAID: { 
    label: "Payé", 
    color: "bg-green-500/20 text-green-400 border-green-500/30", 
    icon: <CheckCircle className="w-4 h-4" /> 
  },
  PENDING: { 
    label: "En attente", 
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
    icon: <Clock className="w-4 h-4" /> 
  },
  OVERDUE: { 
    label: "En retard", 
    color: "bg-red-500/20 text-red-400 border-red-500/30", 
    icon: <AlertTriangle className="w-4 h-4" /> 
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

const paymentMethods = [
  { id: 'orange', name: 'Orange Money', icon: <Smartphone className="w-5 h-5" />, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'wave', name: 'Wave', icon: <Wallet className="w-5 h-5" />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'card', name: 'Carte Bancaire', icon: <CardIcon className="w-5 h-5" />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
];

export default function CotisationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [cotisation, setCotisation] = useState<Cotisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchCotisation = async () => {
      try {
        const response = await fetch(`/api/cotisations/${params.id}`);
        const data = await response.json();
        setCotisation(data);
      } catch (error) {
        console.error("Error fetching cotisation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCotisation();
    }
  }, [params.id]);

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !cotisation) return;
    
    setProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would call the payment API
    setProcessingPayment(false);
    setShowPaymentModal(false);
    
    // Show success message (in real app)
    alert('Paiement simulé avec succès! Dans un environnement réel, vous seriez redirigé vers le service de paiement.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-cinema">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!cotisation) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-cinema">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Cotisation non trouvée</h2>
            <Button onClick={() => router.push('/cotisations')}>
              Retour aux cotisations
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusConfig[cotisation.status] || statusConfig.PENDING;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-cinema">
      <Navigation />
      
      <main className="flex-1 pt-20">
        <section className="py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <Link 
                href="/cotisations"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux cotisations
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold text-foreground">
                              {cotisation.association.name}
                            </h1>
                            <p className="text-muted-foreground">
                              Cotisation {cotisation.year}
                            </p>
                          </div>
                        </div>
                        <Badge className={status.color}>
                          {status.icon}
                          <span className="ml-1">{status.label}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Montant dû</p>
                          <p className="text-2xl font-bold text-foreground">
                            {formatCurrency(cotisation.amount)}
                          </p>
                        </div>
                        <div className="glass-card rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Date d'échéance</p>
                          <p className="text-lg font-semibold text-foreground">
                            {formatDate(cotisation.dueDate)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="glass-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-primary" />
                        Historique des paiements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cotisation.payments.length > 0 ? (
                        <div className="space-y-4">
                          {cotisation.payments.map((payment, index) => (
                            <div key={payment.id}>
                              {index > 0 && <Separator className="my-4 bg-border/30" />}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {formatCurrency(payment.amount)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(payment.paidAt)} via {payment.method}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {payment.transactionId && (
                                    <span className="text-xs text-muted-foreground font-mono">
                                      #{payment.transactionId}
                                    </span>
                                  )}
                                  {payment.receiptUrl && (
                                    <Button size="sm" variant="ghost" className="text-primary">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground">Aucun paiement enregistré</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Association Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="glass-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Informations de l'association</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{cotisation.association.email || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{cotisation.association.phone || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{cotisation.association.address || 'Non renseigné'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment Actions */}
                {cotisation.status !== 'PAID' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="glass-card border-border/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-primary" />
                          Effectuer le paiement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Choisissez votre méthode de paiement pour régler cette cotisation.
                        </p>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => setShowPaymentModal(true)}
                        >
                          Payer {formatCurrency(cotisation.amount)}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Download Receipt */}
                {cotisation.status === 'PAID' && cotisation.receiptUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="glass-card border-border/50">
                      <CardContent className="pt-6">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger le reçu
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle>Choisir le mode de paiement</DialogTitle>
            <DialogDescription>
              Sélectionnez votre méthode de paiement préférée pour régler la cotisation de {formatCurrency(cotisation.amount)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`w-full p-4 rounded-lg border transition-all flex items-center gap-4 ${
                  selectedPaymentMethod === method.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${method.color}`}>
                  {method.icon}
                </div>
                <span className="font-medium text-foreground">{method.name}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowPaymentModal(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!selectedPaymentMethod || processingPayment}
              onClick={handlePayment}
            >
              {processingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Confirmer'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
