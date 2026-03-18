"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Save,
  Edit2,
  Users,
  Calendar,
  Film,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const associationData = {
  id: "1",
  name: "Association des Acteurs de Côte d'Ivoire",
  shortName: "AACI",
  slug: "aaci",
  logo: "/images/associations/aact.png",
  description: "L'Association des Acteurs de Côte d'Ivoire (AACI) est une organisation professionnelle qui représente et défend les intérêts des acteurs et actrices du cinéma et de l'audiovisuel ivoirien. Fondée en 2015, elle compte aujourd'hui plus de 150 membres actifs.",
  category: "COMEDIENS",
  status: "ACTIVE",
  email: "contact@aaci.ci",
  phone: "+225 07 08 09 10 11",
  website: "https://www.aaci.ci",
  address: "Plateau, Rue du Commerce",
  city: "Abidjan",
  latitude: 5.3599,
  longitude: -4.0083,
  foundedYear: 2015,
  memberCount: 156,
  filmCount: 23,
  eventCount: 12,
  socialLinks: {
    facebook: "https://facebook.com/aaci",
    twitter: "https://twitter.com/aaci",
    instagram: "https://instagram.com/aaci",
    youtube: "https://youtube.com/aaci",
  },
};

const categoryLabels: Record<string, string> = {
  COMEDIENS: "Comédiens",
  REALISATEURS: "Réalisateurs",
  PRODUCTEURS: "Producteurs",
  TECHNICIENS: "Techniciens",
  DISTRIBUTEURS: "Distributeurs",
  EXPLOITANTS: "Exploitants",
};

export default function AssociationPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(associationData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        {/* Cover Image */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-4 right-4 bg-black/20 hover:bg-black/30 text-white"
          >
            <Camera className="w-4 h-4 mr-2" />
            Changer la couverture
          </Button>
        </div>

        {/* Association Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
            <div className="relative">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background">
                <AvatarImage src={formData.logo} alt={formData.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display">
                  {formData.shortName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-background border shadow-sm"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground">
                  {formData.shortName}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    {formData.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    {categoryLabels[formData.category]}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground mt-1">
                {formData.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-primary hover:bg-primary/90" : ""}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifier
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Membres", value: formData.memberCount, color: "text-blue-400" },
          { icon: Film, label: "Films", value: formData.filmCount, color: "text-primary" },
          { icon: Calendar, label: "Événements", value: formData.eventCount, color: "text-green-400" },
          { icon: Award, label: "Années", value: new Date().getFullYear() - formData.foundedYear, color: "text-yellow-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/30 text-center">
              <CardContent className="p-4">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="font-display text-3xl text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-xl tracking-wider">
                Informations générales
              </CardTitle>
              <CardDescription>
                Les informations de base de votre association
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortName">Nom court / Sigle</Label>
                  <Input
                    id="shortName"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!isEditing}
                  className="bg-background/50 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Année de fondation</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-xl tracking-wider">
                Coordonnées
              </CardTitle>
              <CardDescription>
                Les informations de contact de votre association
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Site web
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!isEditing}
                  className="bg-background/50"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm text-muted-foreground">
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm text-muted-foreground">
                      Ville
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                      className="bg-background/50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-xl tracking-wider">
                Réseaux sociaux
              </CardTitle>
              <CardDescription>
                Les liens vers vos réseaux sociaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="bg-background/50"
                    placeholder="https://facebook.com/votre-page"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="bg-background/50"
                    placeholder="https://twitter.com/votre-compte"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="bg-background/50"
                    placeholder="https://instagram.com/votre-compte"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="bg-background/50"
                    placeholder="https://youtube.com/votre-chaine"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
