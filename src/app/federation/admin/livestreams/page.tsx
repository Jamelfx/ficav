"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Radio,
  Plus,
  Play,
  Square,
  Eye,
  Users,
  Clock,
  Video,
  Calendar,
  Settings,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock livestreams data
const livestreamsData = [
  {
    id: "1",
    title: "Cérémonie d'ouverture du FESPACI 2025",
    description: "Suivez en direct la cérémonie d'ouverture du Festival du Panafricain du Cinéma.",
    platform: "youtube",
    scheduledAt: "2025-02-15T19:00:00",
    status: "scheduled",
    expectedViewers: 500,
    actualViewers: null,
    duration: null,
    thumbnail: "/images/livestreams/fespaci.jpg",
  },
  {
    id: "2",
    title: "Masterclass : La réalisation documentaire",
    description: "Masterclass avec un réalisateur primé sur les techniques du documentaire.",
    platform: "facebook",
    scheduledAt: "2025-01-28T14:00:00",
    status: "live",
    expectedViewers: 200,
    actualViewers: 156,
    duration: "01:30:00",
    thumbnail: "/images/livestreams/masterclass.jpg",
    streamUrl: "https://facebook.com/ficav/live",
  },
  {
    id: "3",
    title: "Conférence de presse - Nouvelles mesures",
    description: "Présentation des nouvelles mesures de soutien au cinéma ivoirien.",
    platform: "youtube",
    scheduledAt: "2025-01-20T10:00:00",
    status: "completed",
    expectedViewers: 150,
    actualViewers: 203,
    duration: "00:45:00",
    thumbnail: "/images/livestreams/conf-presse.jpg",
    recordingUrl: "https://youtube.com/watch?v=abc123",
  },
  {
    id: "4",
    title: "Remise des prix FICAV 2024",
    description: "Célébration des meilleurs talents de l'année 2024.",
    platform: "youtube",
    scheduledAt: "2024-12-20T19:00:00",
    status: "completed",
    expectedViewers: 300,
    actualViewers: 412,
    duration: "02:15:00",
    thumbnail: "/images/livestreams/prix.jpg",
    recordingUrl: "https://youtube.com/watch?v=def456",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Planifié", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  live: { label: "En direct", color: "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" },
  completed: { label: "Terminé", color: "bg-green-500/10 text-green-400 border-green-500/20" },
};

const platformConfig: Record<string, { label: string; color: string }> = {
  youtube: { label: "YouTube", color: "bg-red-500 text-white" },
  facebook: { label: "Facebook Live", color: "bg-blue-600 text-white" },
  twitch: { label: "Twitch", color: "bg-purple-600 text-white" },
};

export default function LivestreamsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [streamForm, setStreamForm] = useState({
    title: "",
    description: "",
    platform: "youtube",
    scheduledDate: "",
    scheduledTime: "",
    expectedViewers: "",
  });

  const stats = {
    total: livestreamsData.length,
    live: livestreamsData.filter((s) => s.status === "live").length,
    scheduled: livestreamsData.filter((s) => s.status === "scheduled").length,
    completed: livestreamsData.filter((s) => s.status === "completed").length,
    totalViewers: livestreamsData
      .filter((s) => s.actualViewers)
      .reduce((acc, s) => acc + (s.actualViewers || 0), 0),
  };

  const handleCreateStream = () => {
    console.log("Creating livestream:", streamForm);
    alert("Live planifié avec succès");
    setIsCreateOpen(false);
    setStreamForm({
      title: "",
      description: "",
      platform: "youtube",
      scheduledDate: "",
      scheduledTime: "",
      expectedViewers: "",
    });
  };

  const handleGoLive = (streamId: string) => {
    console.log("Going live:", streamId);
    alert("Démarrage du direct...");
  };

  const handleEndStream = (streamId: string) => {
    console.log("Ending stream:", streamId);
    alert("Direct terminé");
  };

  const copyStreamUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copiée !");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
            Gestion des livestreams
          </h1>
          <p className="text-muted-foreground">
            Planifiez et lancez des directs pour la Fédération
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-500/90">
              <Plus className="w-4 h-4 mr-2" />
              Planifier un live
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Planifier un livestream
              </DialogTitle>
              <DialogDescription>
                Configurez votre diffusion en direct
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du live</Label>
                <Input
                  id="title"
                  value={streamForm.title}
                  onChange={(e) => setStreamForm({ ...streamForm, title: e.target.value })}
                  placeholder="Ex: Cérémonie de remise des prix"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={streamForm.description}
                  onChange={(e) => setStreamForm({ ...streamForm, description: e.target.value })}
                  placeholder="Décrivez le contenu de votre live..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Plateforme</Label>
                <Select
                  value={streamForm.platform}
                  onValueChange={(value) => setStreamForm({ ...streamForm, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube Live</SelectItem>
                    <SelectItem value="facebook">Facebook Live</SelectItem>
                    <SelectItem value="twitch">Twitch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={streamForm.scheduledDate}
                    onChange={(e) => setStreamForm({ ...streamForm, scheduledDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={streamForm.scheduledTime}
                    onChange={(e) => setStreamForm({ ...streamForm, scheduledTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="viewers">Audience estimée</Label>
                <Input
                  id="viewers"
                  type="number"
                  value={streamForm.expectedViewers}
                  onChange={(e) => setStreamForm({ ...streamForm, expectedViewers: e.target.value })}
                  placeholder="200"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-500/90"
                  onClick={handleCreateStream}
                  disabled={!streamForm.title || !streamForm.scheduledDate}
                >
                  Planifier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total lives", value: stats.total, icon: Radio },
          { label: "En direct", value: stats.live, icon: Play, color: "text-red-400" },
          { label: "Planifiés", value: stats.scheduled, icon: Calendar, color: "text-blue-400" },
          { label: "Terminés", value: stats.completed, icon: CheckCircle2, color: "text-green-400" },
          { label: "Total vues", value: stats.totalViewers, icon: Eye, color: "text-primary" },
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
                  <stat.icon className={`w-5 h-5 ${stat.color || "text-muted-foreground"}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live Now Banner */}
      {livestreamsData.some((s) => s.status === "live") && (
        <Card className="glass-card border-red-500/30 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <p className="font-medium">Un live est en cours !</p>
                  <p className="text-sm text-muted-foreground">
                    {livestreamsData.find((s) => s.status === "live")?.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white">
                  {livestreamsData.find((s) => s.status === "live")?.actualViewers} spectateurs
                </Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Voir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Livestreams List */}
      <div className="space-y-4">
        {livestreamsData.map((stream, index) => {
          const status = statusConfig[stream.status];
          const platform = platformConfig[stream.platform];
          
          return (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-card border-border/30 hover:border-primary/30 transition-colors ${stream.status === "live" ? "border-red-500/30" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-14 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                        {stream.status === "live" ? (
                          <div className="w-full h-full bg-red-500/20 flex items-center justify-center">
                            <Play className="w-6 h-6 text-red-400" />
                          </div>
                        ) : stream.status === "scheduled" ? (
                          <Video className="w-6 h-6 text-muted-foreground" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold text-foreground">
                            {stream.title}
                          </h3>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                          <Badge className={platform.color}>
                            {platform.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {stream.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(stream.scheduledAt).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(stream.scheduledAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {stream.actualViewers || stream.expectedViewers} vues
                            {stream.status === "live" && (
                              <span className="ml-1 text-red-400">(live)</span>
                            )}
                          </span>
                          {stream.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {stream.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {stream.status === "scheduled" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-500/90"
                            onClick={() => handleGoLive(stream.id)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Démarrer
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {stream.status === "live" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyStreamUrl(stream.streamUrl || "")}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            URL
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEndStream(stream.id)}
                          >
                            <Square className="w-4 h-4 mr-1" />
                            Terminer
                          </Button>
                        </>
                      )}
                      {stream.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Rediffusion
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
    </div>
  );
}
