"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ParametresPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newsletter: true,
    events: true,
    members: true,
    cotisations: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
              Paramètres
            </h1>
            <p className="text-muted-foreground">
              Gérez vos préférences et paramètres de compte
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <div className="grid gap-6">
            {/* Profile */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-wider flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profil administrateur
                </CardTitle>
                <CardDescription>
                  Informations du compte administrateur de l&apos;association
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 border-2 border-primary/30">
                    <AvatarImage src="/images/associations/aact.png" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xl">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-foreground">Admin AACI</h3>
                    <p className="text-sm text-muted-foreground">admin@aaci.ci</p>
                    <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20">
                      Administrateur
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Nom complet</Label>
                    <Input id="admin-name" defaultValue="Admin AACI" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@aaci.ci" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-phone">Téléphone</Label>
                    <Input id="admin-phone" defaultValue="+225 07 00 00 00 00" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-role">Rôle</Label>
                    <Select defaultValue="admin">
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="editor">Éditeur</SelectItem>
                        <SelectItem value="viewer">Lecteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Language & Region */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-wider flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Langue et région
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select defaultValue="africa_abidjan">
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa_abidjan">Afrique/Abidjan (GMT+0)</SelectItem>
                        <SelectItem value="europe_paris">Europe/Paris (GMT+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Select defaultValue="xof">
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xof">FCFA (XOF)</SelectItem>
                        <SelectItem value="eur">Euro (EUR)</SelectItem>
                        <SelectItem value="usd">Dollar US (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">JJ/MM/AAAA</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/JJ/AAAA</SelectItem>
                        <SelectItem value="yyyy-mm-dd">AAAA-MM-JJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-xl tracking-wider flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Préférences de notification
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Channels */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Canaux de notification</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <p className="text-xs text-muted-foreground">Recevoir les notifications par email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Push</p>
                        <p className="text-xs text-muted-foreground">Notifications push dans le navigateur</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">SMS</p>
                        <p className="text-xs text-muted-foreground">Recevoir les notifications par SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Types */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Types de notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm font-medium text-foreground">Nouveaux membres</p>
                      <p className="text-xs text-muted-foreground">Quand un nouveau membre s&apos;inscrit</p>
                    </div>
                    <Switch
                      checked={notifications.members}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, members: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm font-medium text-foreground">Événements</p>
                      <p className="text-xs text-muted-foreground">Rappels et nouvelles d&apos;événements</p>
                    </div>
                    <Switch
                      checked={notifications.events}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, events: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm font-medium text-foreground">Cotisations</p>
                      <p className="text-xs text-muted-foreground">Paiements et rappels de cotisations</p>
                    </div>
                    <Switch
                      checked={notifications.cotisations}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, cotisations: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm font-medium text-foreground">Newsletter FICAV</p>
                      <p className="text-xs text-muted-foreground">Actualités de la fédération</p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid gap-6">
            {/* Password */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-wider flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Mot de passe
                </CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
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
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    Modifier le mot de passe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Two-Factor */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-wider flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Authentification à deux facteurs
                </CardTitle>
                <CardDescription>
                  Ajoutez une couche de sécurité supplémentaire à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">2FA activée</p>
                      <p className="text-xs text-muted-foreground">
                        Votre compte est protégé par authentification à deux facteurs
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Configurer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sessions */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-wider">
                  Sessions actives
                </CardTitle>
                <CardDescription>
                  Gérez les appareils connectés à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Chrome sur Windows</p>
                        <p className="text-xs text-muted-foreground">Abidjan, Côte d&apos;Ivoire • Actif maintenant</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      Session actuelle
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Safari sur iPhone</p>
                        <p className="text-xs text-muted-foreground">Abidjan, Côte d&apos;Ivoire • Il y a 2 jours</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Déconnecter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-xl tracking-wider flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l&apos;apparence de votre interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Thème</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 rounded-xl border-2 border-primary bg-primary/5 text-center">
                    <div className="w-8 h-8 mx-auto rounded-full bg-background border mb-2" />
                    <span className="text-sm font-medium">Clair</span>
                  </button>
                  <button className="p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 text-center transition-colors">
                    <div className="w-8 h-8 mx-auto rounded-full bg-foreground border mb-2" />
                    <span className="text-sm font-medium">Sombre</span>
                  </button>
                  <button className="p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 text-center transition-colors">
                    <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-r from-background to-foreground border mb-2" />
                    <span className="text-sm font-medium">Système</span>
                  </button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Couleur d&apos;accent</Label>
                <div className="flex gap-3">
                  {[
                    { color: "oklch(0.70 0.18 45)", name: "Orange" },
                    { color: "oklch(0.65 0.20 250)", name: "Bleu" },
                    { color: "oklch(0.60 0.18 150)", name: "Vert" },
                    { color: "oklch(0.65 0.20 320)", name: "Rose" },
                    { color: "oklch(0.70 0.15 280)", name: "Violet" },
                  ].map((accent) => (
                    <button
                      key={accent.name}
                      className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                        accent.name === "Orange" ? "border-foreground scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: accent.color }}
                      title={accent.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
