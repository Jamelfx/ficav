"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogIn, UserPlus, FileText, Mail, Phone, Building2, LogOut, LayoutDashboard, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const associationTypes = [
  { value: "COMEDIENS", label: "Comédiens" },
  { value: "REALISATEURS", label: "Réalisateurs" },
  { value: "PRODUCTEURS", label: "Producteurs" },
  { value: "TECHNICIENS", label: "Techniciens" },
  { value: "DISTRIBUTEURS", label: "Distributeurs" },
  { value: "EXPLOITANTS", label: "Exploitants" },
  { value: "MIXTE", label: "Mixte" },
];

export function UserMenu() {
  const { user, isAuthenticated, isHydrated, login, logout, isLoading } = useAuth();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("connexion");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Listen for openRegister event from HeroSection
  useEffect(() => {
    const handleOpenRegister = () => {
      setIsOpen(true);
      setActiveTab("inscription");
    };
    window.addEventListener("openRegister", handleOpenRegister);
    return () => window.removeEventListener("openRegister", handleOpenRegister);
  }, []);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    denomination: "",
    type: "",
    sigle: "",
    presidentNom: "",
    presidentPrenoms: "",
    email: "",
    telephone: "",
    logo: null as File | null,
    statuts: null as File | null,
    recepisse: null as File | null,
    immatriculation: null as File | null,
    bureau: null as File | null,
    membresActifs: null as File | null,
    lettreAffiliation: null as File | null,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const success = await login(loginForm.email, loginForm.password);
      
      if (success) {
        toast.success("Connexion réussie", {
          description: `Bienvenue ! Vous êtes maintenant connecté.`,
        });
        setIsOpen(false);
        
        // Get the updated user from localStorage to determine redirect
        const stored = localStorage.getItem("ficav_user");
        if (stored) {
          const loggedUser = JSON.parse(stored);
          const federationRoles = ["PRESIDENT", "SECRETAIRE_GENERAL", "TRESORIERE", "DIRECTEUR_COMMUNICATION"];
          const isFederationStaff = federationRoles.includes(loggedUser.role);
          window.location.href = isFederationStaff ? "/federation/admin" : "/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        toast.error("Erreur de connexion", {
          description: "Email ou mot de passe incorrect. Utilisez n'importe quel email avec un mot de passe de 4+ caractères.",
        });
      }
    } catch {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la connexion.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic
    toast.success("Demande envoyée", {
      description: "Votre demande d'adhésion a été soumise. Elle sera examinée par le Bureau Fédéral.",
    });
    setIsOpen(false);
  };

  const handleFileChange = (field: keyof typeof registerForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRegisterForm({ ...registerForm, [field]: file });
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion", {
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      PRESIDENT: "Président",
      SECRETAIRE_GENERAL: "Secrétaire Général",
      TRESORIERE: "Trésorière",
      DIRECTEUR_COMMUNICATION: "Directeur de la Communication",
      ADMIN_ASSOCIATION: "Admin Association",
    };
    return labels[role] || role;
  };

  // Show loading skeleton during hydration to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center animate-pulse">
        <User className="w-5 h-5 text-primary/50" />
      </div>
    );
  }

  // If user is authenticated, show user dropdown
  if (isAuthenticated && user) {
    const isFederationStaff = ["PRESIDENT", "SECRETAIRE_GENERAL", "TRESORIERE", "DIRECTEUR_COMMUNICATION"].includes(user.role);
    const dashboardUrl = isFederationStaff ? "/federation/admin" : "/dashboard";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border-2 border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all group">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-display">
                {user.name?.charAt(0) || user.associationShortName?.slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-medium text-foreground">
              {isFederationStaff ? getRoleLabel(user.role) : user.associationShortName}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 glass-card">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
              <Badge className="mt-1 bg-primary/20 text-primary text-[10px] px-2 py-0.5 w-fit">
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.location.href = dashboardUrl} className="cursor-pointer">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            {isFederationStaff ? "Admin Fédération" : "Tableau de bord"}
          </DropdownMenuItem>
          
          {/* Association-specific items */}
          {!isFederationStaff && (
            <>
              <DropdownMenuItem onClick={() => window.location.href = "/dashboard/association"} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Mon profil
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If not authenticated, show login/register button
  return (
    <>
      {/* User Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all group"
      >
        <User className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
      </button>

      {/* User Menu Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-wider text-center">
              Espace Membre FICAV
            </DialogTitle>
            <DialogDescription className="text-center">
              Connectez-vous ou rejoignez la fédération
            </DialogDescription>
            <p className="text-xs text-center text-muted-foreground mt-2 bg-primary/10 p-2 rounded-lg">
              💡 Demo: Utilisez n&apos;importe quel email avec un mot de passe de 4+ caractères
            </p>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2 glass">
              <TabsTrigger value="connexion" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Connexion
              </TabsTrigger>
              <TabsTrigger value="inscription" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Devenir Membre
              </TabsTrigger>
            </TabsList>

            {/* Connexion Tab */}
            <TabsContent value="connexion" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Adresse e-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="bg-background/50"
                    required
                    minLength={4}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Se souvenir de moi</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Se connecter
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Inscription Tab */}
            <TabsContent value="inscription" className="mt-6">
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Section: Informations générales */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Informations de l&apos;association
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="denomination">Dénomination de votre association *</Label>
                      <Input
                        id="denomination"
                        placeholder="Ex: Association des Réalisateurs de Côte d'Ivoire"
                        value={registerForm.denomination}
                        onChange={(e) => setRegisterForm({ ...registerForm, denomination: e.target.value })}
                        className="bg-background/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type d&apos;association *</Label>
                      <Select
                        value={registerForm.type}
                        onValueChange={(value) => setRegisterForm({ ...registerForm, type: value })}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {associationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sigle">Sigle de l&apos;association *</Label>
                      <Input
                        id="sigle"
                        placeholder="Ex: ARCI"
                        value={registerForm.sigle}
                        onChange={(e) => setRegisterForm({ ...registerForm, sigle: e.target.value })}
                        className="bg-background/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="president-nom">Nom du Président *</Label>
                      <Input
                        id="president-nom"
                        placeholder="Nom"
                        value={registerForm.presidentNom}
                        onChange={(e) => setRegisterForm({ ...registerForm, presidentNom: e.target.value })}
                        className="bg-background/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="president-prenoms">Prénoms du Président *</Label>
                      <Input
                        id="president-prenoms"
                        placeholder="Prénoms"
                        value={registerForm.presidentPrenoms}
                        onChange={(e) => setRegisterForm({ ...registerForm, presidentPrenoms: e.target.value })}
                        className="bg-background/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Contact */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Contact
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail de l&apos;association *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@association.ci"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="bg-background/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        placeholder="+225 07 XX XX XX XX"
                        value={registerForm.telephone}
                        onChange={(e) => setRegisterForm({ ...registerForm, telephone: e.target.value })}
                        className="bg-background/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Logo */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Logo de l&apos;association
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo (JPEG ou PNG) *</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-xl p-4 hover:border-primary/50 transition-colors">
                      <input
                        id="logo"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange("logo")}
                        className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      {registerForm.logo && (
                        <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {registerForm.logo.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Documents */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documents requis (PDF)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="statuts">Statuts et règlement intérieur *</Label>
                      <div className="border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors">
                        <input
                          id="statuts"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange("statuts")}
                          className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recepisse">Récépissé de dépôt *</Label>
                      <div className="border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors">
                        <input
                          id="recepisse"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange("recepisse")}
                          className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="immatriculation">Immatriculation Ministère de la Culture *</Label>
                      <div className="border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors">
                        <input
                          id="immatriculation"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange("immatriculation")}
                          className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bureau">Liste des membres du bureau *</Label>
                      <div className="border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors">
                        <input
                          id="bureau"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange("bureau")}
                          className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="membresActifs">Liste des membres actifs *</Label>
                      <div className="border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors">
                        <input
                          id="membresActifs"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange("membresActifs")}
                          className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lettreAffiliation">Lettre d&apos;affiliation au Bureau Fédéral *</Label>
                      <div className="border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors">
                        <input
                          id="lettreAffiliation"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange("lettreAffiliation")}
                          className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Soumettre la demande d&apos;adhésion
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Votre demande sera examinée par le Bureau Fédéral. Vous recevrez une réponse sous 15 jours ouvrables.
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
