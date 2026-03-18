"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  Smartphone,
  Building2,
  Wallet,
  Receipt,
  Download,
  ChevronRight,
  Shield,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Types
type PaymentStatus = "PAID" | "PENDING" | "OVERDUE";

type MembershipInfo = {
  isPaid: boolean;
  amount: number;
  paidAt: string | null;
  year: number;
  status: PaymentStatus;
};

type Cotisation = {
  id: string;
  year: number;
  month: number | null;
  type: "MONTHLY" | "ANNUAL";
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt: string | null;
  paymentMethod: string | null;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  fees: string;
};

const paymentMethods: PaymentMethod[] = [
  {
    id: "orange_money",
    name: "Orange Money",
    icon: Smartphone,
    description: "Paiement via Orange Money",
    fees: "0%",
  },
  {
    id: "wave",
    name: "Wave",
    icon: Wallet,
    description: "Paiement via Wave",
    fees: "0%",
  },
  {
    id: "bank_transfer",
    name: "Virement bancaire",
    icon: Building2,
    description: "Virement vers le compte FICAV",
    fees: "Frais bancaires applicables",
  },
  {
    id: "cash",
    name: "Espèces",
    icon: DollarSign,
    description: "Paiement en espèces au bureau",
    fees: "0%",
  },
];

const ADHESION_AMOUNT = 50000; // 50,000 FCFA
const MONTHLY_COTISATION = 10000; // 10,000 FCFA/month
const ANNUAL_COTISATION = 100000; // 100,000 FCFA/year (save 20,000 FCFA)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(amount) + " FCFA";
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default function CotisationsPage() {
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<"adhesion" | "cotisation" | "monthly" | "annual">("adhesion");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("orange_money");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/association/payments");
      const data = await response.json();
      
      if (data.membership) {
        setMembership(data.membership);
      }
      if (data.cotisations) {
        setCotisations(data.cotisations);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      // Set mock data for demo
      setMembership({
        isPaid: false,
        amount: ADHESION_AMOUNT,
        paidAt: null,
        year: new Date().getFullYear(),
        status: "PENDING",
      });
      setCotisations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (paymentType === "adhesion" || paymentType === "cotisation") {
      if (!phoneNumber && (selectedPaymentMethod === "orange_money" || selectedPaymentMethod === "wave")) {
        toast.error("Veuillez entrer votre numéro de téléphone");
        return;
      }
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/association/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: paymentType,
          method: selectedPaymentMethod,
          phoneNumber: phoneNumber,
          amount: getPaymentAmount(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Paiement initié avec succès!");
        setShowPaymentDialog(false);
        fetchData();
      } else {
        toast.error(data.error || "Erreur lors du paiement");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erreur lors du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentAmount = () => {
    switch (paymentType) {
      case "adhesion":
        return ADHESION_AMOUNT;
      case "monthly":
        return MONTHLY_COTISATION;
      case "annual":
        return ANNUAL_COTISATION;
      default:
        return 0;
    }
  };

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return { label: "Payé", icon: CheckCircle2, color: "text-green-400", bgColor: "bg-green-500/10 border-green-500/20" };
      case "PENDING":
        return { label: "En attente", icon: Clock, color: "text-yellow-400", bgColor: "bg-yellow-500/10 border-yellow-500/20" };
      case "OVERDUE":
        return { label: "En retard", icon: AlertCircle, color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/20" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalPaid = cotisations.filter(c => c.status === "PAID").reduce((acc, c) => acc + c.amount, 0);
  const totalDue = cotisations.reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Alert - Membership not paid */}
      {membership && !membership.isPaid && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-orange-500/50 bg-orange-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-orange-400">Adhésion non payée</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Votre adhésion à la FICAV pour l&apos;année {membership.year} n&apos;a pas encore été réglée.
                    Veuillez régler votre adhésion pour accéder à toutes les fonctionnalités.
                  </p>
                </div>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    setPaymentType("adhesion");
                    setShowPaymentDialog(true);
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer {formatCurrency(ADHESION_AMOUNT)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: "Adhésion", 
            value: membership?.isPaid ? "Payée" : "Non payée", 
            icon: Shield, 
            color: membership?.isPaid ? "text-green-400" : "text-orange-400" 
          },
          { 
            label: "Cotisations payées", 
            value: formatCurrency(totalPaid), 
            icon: CheckCircle2, 
            color: "text-green-400" 
          },
          { 
            label: "Reste à payer", 
            value: formatCurrency(totalDue - totalPaid), 
            icon: Clock, 
            color: "text-yellow-400" 
          },
          { 
            label: "Type", 
            value: "Annuel recommandé", 
            icon: Star, 
            color: "text-primary" 
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
                    <p className={`font-display text-lg mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Payment Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adhésion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`glass-card ${membership?.isPaid ? "border-green-500/30" : "border-orange-500/30"}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Adhésion FICAV
                  </CardTitle>
                  <CardDescription>Frais d&apos;adhésion annuels</CardDescription>
                </div>
                {membership?.isPaid ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Payée
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    En attente
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-3xl font-display font-bold text-primary">
                  {formatCurrency(ADHESION_AMOUNT)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">par an</p>
              </div>
              
              {membership?.isPaid ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payée le</span>
                    <span className="font-medium">{membership.paidAt ? formatDate(membership.paidAt) : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Année</span>
                    <span className="font-medium">{membership.year}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le reçu
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setPaymentType("adhesion");
                    setShowPaymentDialog(true);
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer mon adhésion
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Cotisation Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Cotisations
              </CardTitle>
              <CardDescription>Choisissez votre mode de paiement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Monthly Option */}
                <div className="p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setPaymentType("monthly");
                    setShowPaymentDialog(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Cotisation Mensuelle</p>
                        <p className="text-sm text-muted-foreground">Paiement chaque mois</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold">{formatCurrency(MONTHLY_COTISATION)}</p>
                      <p className="text-xs text-muted-foreground">/mois</p>
                    </div>
                  </div>
                </div>

                {/* Annual Option */}
                <div className="p-4 rounded-xl border-2 border-primary/50 bg-primary/5 relative cursor-pointer"
                  onClick={() => {
                    setPaymentType("annual");
                    setShowPaymentDialog(true);
                  }}
                >
                  <div className="absolute -top-2 right-4">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      Recommandé - 20% économie
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Cotisation Annuelle</p>
                        <p className="text-sm text-muted-foreground">Une fois par an, économisez 20,000 FCFA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-primary">{formatCurrency(ANNUAL_COTISATION)}</p>
                      <p className="text-xs text-muted-foreground line-through">{formatCurrency(120000)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="font-display text-lg">Historique des paiements</CardTitle>
            <CardDescription>Vos paiements d&apos;adhésion et cotisations</CardDescription>
          </CardHeader>
          <CardContent>
            {cotisations.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun paiement enregistré</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Effectuez votre première cotisation pour commencer
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cotisations.map((cotis, index) => {
                  const status = getStatusConfig(cotis.status);
                  return (
                    <motion.div
                      key={cotis.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${status.bgColor}`}>
                          <status.icon className={`w-5 h-5 ${status.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {cotis.type === "ANNUAL" 
                              ? `Cotisation annuelle ${cotis.year}`
                              : `Cotisation ${monthNames[cotis.month!]} ${cotis.year}`
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {cotis.paidAt ? `Payé le ${formatDate(cotis.paidAt)}` : `Échéance: ${formatDate(cotis.dueDate)}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold">{formatCurrency(cotis.amount)}</p>
                        <Badge variant="outline" className={`${status.bgColor} ${status.color} mt-1`}>
                          {status.label}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {paymentType === "adhesion" && "Paiement de l'adhésion"}
              {paymentType === "monthly" && "Cotisation mensuelle"}
              {paymentType === "annual" && "Cotisation annuelle"}
            </DialogTitle>
            <DialogDescription>
              Choisissez votre moyen de paiement
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Amount */}
            <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground">Montant à payer</p>
              <p className="text-3xl font-display font-bold text-primary mt-1">
                {formatCurrency(getPaymentAmount())}
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Moyen de paiement</Label>
              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <method.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{method.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{method.fees}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Phone Number for Mobile Money */}
            {(selectedPaymentMethod === "orange_money" || selectedPaymentMethod === "wave") && (
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07 00 00 00 00"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Vous recevrez une notification pour confirmer le paiement
                </p>
              </div>
            )}

            {/* Bank Transfer Info */}
            {selectedPaymentMethod === "bank_transfer" && (
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <p className="text-sm font-medium">Coordonnées bancaires FICAV:</p>
                <p className="text-sm text-muted-foreground">Banque: [Nom de la banque]</p>
                <p className="text-sm text-muted-foreground">IBAN: [Numéro IBAN]</p>
                <p className="text-sm text-muted-foreground">Code Swift: [Code Swift]</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Veuillez inclure votre nom d&apos;association en référence
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Annuler
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Traitement...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer {formatCurrency(getPaymentAmount())}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
