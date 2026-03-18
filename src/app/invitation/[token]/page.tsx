"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Lock,
  User,
  Smartphone,
  Wallet,
  DollarSign,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type InvitationData = {
  id: string;
  associationName: string;
  associationShortName: string;
  email: string;
  membershipFee: number;
  firstCotisation: number | null;
  requirePayment: boolean;
  isPaid: boolean;
  invitationToken: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: React.ElementType;
};

const paymentMethods: PaymentMethod[] = [
  { id: "orange_money", name: "Orange Money", icon: Smartphone },
  { id: "wave", name: "Wave", icon: Wallet },
  { id: "bank_transfer", name: "Virement bancaire", icon: Building2 },
  { id: "cash", name: "Espèces", icon: DollarSign },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(amount) + " FCFA";
};

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(true);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  // Payment form
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("orange_money");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Account creation form
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  useEffect(() => {
    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/invitation/${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invitation non trouvée");
      } else {
        setInvitation(data.invitation);
        if (data.invitation.isPaid) {
          setIsPaymentComplete(true);
          setCurrentStep(2);
        }
      }
    } catch (err) {
      console.error("Error fetching invitation:", err);
      setError("Erreur lors du chargement de l'invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!invitation) return;

    if ((selectedPaymentMethod === "orange_money" || selectedPaymentMethod === "wave") && !phoneNumber) {
      toast.error("Veuillez entrer votre numéro de téléphone");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const response = await fetch(`/api/invitation/${token}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedPaymentMethod,
          phoneNumber,
          amount: invitation.membershipFee,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Paiement effectué avec succès!");
        setIsPaymentComplete(true);
        setCurrentStep(2);
      } else {
        toast.error(data.error || "Erreur lors du paiement");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Erreur lors du paiement");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!invitation) return;

    if (!password || password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsCreatingAccount(true);
    try {
      const response = await fetch(`/api/invitation/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          email: invitation.email,
          associationName: invitation.associationName,
          associationShortName: invitation.associationShortName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Compte créé avec succès!");
        // Redirect to login
        router.push("/?login=true");
      } else {
        toast.error(data.error || "Erreur lors de la création du compte");
      }
    } catch (err) {
      console.error("Account creation error:", err);
      toast.error("Erreur lors de la création du compte");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cinema">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Chargement de l&apos;invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cinema p-4">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Invitation invalide</h1>
            <p className="text-muted-foreground mb-6">
              {error || "Cette invitation n&apos;existe pas ou a expiré."}
            </p>
            <Button onClick={() => router.push("/")}>
              Retour à l&apos;accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAmount = invitation.membershipFee + (invitation.firstCotisation || 0);

  return (
    <div className="min-h-screen bg-gradient-cinema py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">FICAV - Invitation</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wider">
            Bienvenue, <span className="text-primary">{invitation.associationShortName}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {invitation.associationName}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Étape {currentStep} sur {invitation.requirePayment ? 2 : 1}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentStep === 1 && invitation.requirePayment ? "Paiement de l'adhésion" : "Création du compte"}
            </span>
          </div>
          <Progress value={(currentStep / (invitation.requirePayment ? 2 : 1)) * 100} className="h-2" />
        </motion.div>

        {/* Step 1: Payment */}
        {currentStep === 1 && invitation.requirePayment && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Paiement de l&apos;adhésion
                </CardTitle>
                <CardDescription>
                  Pour rejoindre la FICAV, veuillez régler vos frais d&apos;adhésion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Summary */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Frais d&apos;adhésion</span>
                    <span className="font-medium">{formatCurrency(invitation.membershipFee)}</span>
                  </div>
                  {invitation.firstCotisation && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Première cotisation</span>
                      <span className="font-medium">{formatCurrency(invitation.firstCotisation)}</span>
                    </div>
                  )}
                  <Separator className="my-2 bg-primary/20" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total à payer</span>
                    <span className="font-display text-xl font-bold text-primary">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
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
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer flex items-center gap-2">
                          <method.icon className="w-5 h-5 text-muted-foreground" />
                          <span>{method.name}</span>
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
                  </div>
                )}

                {/* Pay Button */}
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payer {formatCurrency(totalAmount)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Account Creation */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Payment Success Banner */}
            {invitation.requirePayment && (
              <Card className="glass-card border-green-500/30 bg-green-500/5 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="font-medium text-green-400">Paiement confirmé</p>
                      <p className="text-sm text-muted-foreground">
                        Votre adhésion a été enregistrée avec succès
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Création de votre compte
                </CardTitle>
                <CardDescription>
                  Définissez votre mot de passe pour accéder à votre espace membre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Display */}
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse email</p>
                      <p className="font-medium">{invitation.email}</p>
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 6 caractères"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Retapez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                {/* Create Account Button */}
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                  onClick={handleCreateAccount}
                  disabled={isCreatingAccount}
                >
                  {isCreatingAccount ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Créer mon compte
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
