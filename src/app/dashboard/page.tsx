"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Film,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Stats data
const stats = [
  {
    title: "Membres actifs",
    value: 156,
    change: +12,
    changeType: "increase",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    title: "Films enregistrés",
    value: 23,
    change: +3,
    changeType: "increase",
    icon: Film,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Événements à venir",
    value: 4,
    change: 0,
    changeType: "neutral",
    icon: Calendar,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    title: "Cotisations perçues",
    value: "78%",
    change: +15,
    changeType: "increase",
    icon: CreditCard,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
];

// Recent activities
const recentActivities = [
  {
    id: 1,
    type: "member",
    title: "Nouveau membre inscrit",
    description: "Kouame Jean a rejoint l'association",
    time: "Il y a 2 heures",
    status: "success",
  },
  {
    id: 2,
    type: "film",
    title: "Film ajouté",
    description: "\"Le Réveil des Ancêtres\" ajouté au catalogue",
    time: "Hier",
    status: "success",
  },
  {
    id: 3,
    type: "payment",
    title: "Cotisation reçue",
    description: "Paiement de 50,000 FCFA de Yao Paul",
    time: "Hier",
    status: "success",
  },
  {
    id: 4,
    type: "event",
    title: "Événement créé",
    description: "Workshop \"Acting for Camera\" programmé",
    time: "Il y a 3 jours",
    status: "pending",
  },
  {
    id: 5,
    type: "alert",
    title: "Cotisation en retard",
    description: "3 membres n'ont pas payé leur cotisation",
    time: "Il y a 5 jours",
    status: "warning",
  },
];

// Upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Workshop Acting for Camera",
    date: "15 Jan 2025",
    time: "14:00",
    location: "Abidjan, Plateau",
    attendees: 45,
    maxAttendees: 60,
  },
  {
    id: 2,
    title: "Assemblée Générale Ordinaire",
    date: "20 Jan 2025",
    time: "09:00",
    location: "Salle de conférence FICAV",
    attendees: 89,
    maxAttendees: 150,
  },
  {
    id: 3,
    title: "Masterclass Réalisation",
    date: "28 Jan 2025",
    time: "10:00",
    location: "Institut Français",
    attendees: 32,
    maxAttendees: 40,
  },
];

// Quick actions
const quickActions = [
  {
    title: "Ajouter un membre",
    description: "Enregistrer un nouveau membre",
    icon: Users,
    href: "/dashboard/membres?add=true",
    color: "text-blue-400",
  },
  {
    title: "Ajouter un film",
    description: "Enregistrer un nouveau film",
    icon: Film,
    href: "/dashboard/films?add=true",
    color: "text-primary",
  },
  {
    title: "Créer un événement",
    description: "Organiser un événement",
    icon: Calendar,
    href: "/dashboard/evenements?add=true",
    color: "text-green-400",
  },
  {
    title: "Envoyer un document",
    description: "Partager un document",
    icon: FileText,
    href: "/dashboard/documents?add=true",
    color: "text-yellow-400",
  },
];

// Recent members
const recentMembers = [
  { id: 1, name: "Kouame Jean", role: "Acteur", joined: "12 Jan 2025", status: "active" },
  { id: 2, name: "Yao Paul", role: "Réalisateur", joined: "10 Jan 2025", status: "active" },
  { id: 3, name: "Aya Marie", role: "Actrice", joined: "08 Jan 2025", status: "pending" },
  { id: 4, name: "Diallo Amadou", role: "Technicien", joined: "05 Jan 2025", status: "active" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl tracking-wider text-foreground mb-2">
              Bienvenue, AACI
            </h2>
            <p className="text-muted-foreground">
              Voici un aperçu de votre association. Dernière connexion: aujourd&apos;hui à 08:30
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Association active
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Membre FICAV
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/30 hover:glow-orange transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  {stat.change !== 0 && (
                    <div className={`flex items-center text-xs ${
                      stat.changeType === "increase" ? "text-green-400" : "text-red-400"
                    }`}>
                      {stat.changeType === "increase" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {stat.change > 0 ? "+" : ""}{stat.change}%
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <div className="font-display text-3xl text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-xl tracking-wider">
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      href={action.href}
                      className="group flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-border/30 transition-all"
                    >
                      <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 mb-3 ${action.color}`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-foreground text-center">
                        {action.title}
                      </span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        {action.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cotisations Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-border/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-xl tracking-wider">
                    Cotisations 2025
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/cotisations">
                      Voir détails
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium text-foreground">122 / 156 membres</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-3 rounded-xl bg-green-500/10">
                      <div className="font-display text-2xl text-green-400">122</div>
                      <p className="text-xs text-muted-foreground">À jour</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-yellow-500/10">
                      <div className="font-display text-2xl text-yellow-400">18</div>
                      <p className="text-xs text-muted-foreground">En attente</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-red-500/10">
                      <div className="font-display text-2xl text-red-400">16</div>
                      <p className="text-xs text-muted-foreground">En retard</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-border/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-xl tracking-wider">
                    Nouveaux membres
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/membres">
                      Voir tout
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.role} • {member.joined}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          member.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }
                      >
                        {member.status === "active" ? "Actif" : "En attente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-border/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-xl tracking-wider">
                    Événements à venir
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/evenements">
                      Voir tout
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground line-clamp-1">
                          {event.title}
                        </h4>
                        <Badge variant="outline" className="text-xs shrink-0 ml-2">
                          {event.date}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[...Array(Math.min(3, event.attendees))].map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] text-primary"
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            +{event.attendees - 3}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {event.attendees}/{event.maxAttendees}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/dashboard/evenements?add=true">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un événement
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-xl tracking-wider">
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className={`mt-0.5 ${
                        activity.status === "success" ? "text-green-400" :
                        activity.status === "warning" ? "text-yellow-400" :
                        activity.status === "pending" ? "text-blue-400" :
                        "text-muted-foreground"
                      }`}>
                        {activity.status === "success" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : activity.status === "warning" ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
