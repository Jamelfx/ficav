"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Calendar,
  Radio,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data
const stats = {
  totalAssociations: 12,
  pendingApplications: 3,
  totalCotisations: 2450000,
  pendingCotisations: 450000,
  upcomingMeetings: 2,
  activeLivestreams: 0,
};

const recentApplications = [
  {
    id: "1",
    name: "Association des Scénaristes de Côte d'Ivoire",
    status: "pending",
    date: "2025-01-10",
  },
  {
    id: "2",
    name: "Guilde des Monteurs Ivoiriens",
    status: "pending",
    date: "2025-01-08",
  },
  {
    id: "3",
    name: "Collectif des Chef Opérateurs",
    status: "under_review",
    date: "2025-01-05",
  },
];

const recentCotisations = [
  {
    id: "1",
    association: "AACI",
    amount: 150000,
    status: "paid",
    date: "2025-01-12",
  },
  {
    id: "2",
    association: "ARCI",
    amount: 150000,
    status: "pending",
    date: "2025-01-10",
  },
  {
    id: "3",
    association: "APCI",
    amount: 100000,
    status: "overdue",
    date: "2024-12-15",
  },
];

export default function FederationAdminPage() {
  const { user, canConvokeMeetings, canManageApplications, canManageWebsite, canManageFinances } = useAuth();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "PRESIDENT":
        return "Président";
      case "SECRETAIRE_GENERAL":
        return "Secrétaire Général";
      case "TRESORIERE":
        return "Trésorière";
      case "DIRECTEUR_COMMUNICATION":
        return "Directeur de la Communication";
      default:
        return role;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold tracking-wider text-foreground">
          Bienvenue, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {getRoleLabel(user?.role || "")} - Fédération FICAV
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Associations membres",
            value: stats.totalAssociations,
            icon: Building2,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
          },
          {
            label: "Candidatures en attente",
            value: stats.pendingApplications,
            icon: Users,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
          },
          {
            label: "Cotisations perçues",
            value: formatCurrency(stats.totalCotisations),
            icon: CreditCard,
            color: "text-green-400",
            bg: "bg-green-400/10",
          },
          {
            label: "Réunions à venir",
            value: stats.upcomingMeetings,
            icon: Calendar,
            color: "text-primary",
            bg: "bg-primary/10",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Role-specific Quick Actions */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="font-display text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {canConvokeMeetings && (
              <Link href="/federation/admin/meetings">
                <Button className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20">
                  <Calendar className="w-4 h-4 mr-2" />
                  Convoquer une réunion
                </Button>
              </Link>
            )}
            {canManageApplications && (
              <Link href="/federation/admin/applications">
                <Button className="w-full justify-start bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20">
                  <Users className="w-4 h-4 mr-2" />
                  Traiter les candidatures
                </Button>
              </Link>
            )}
            {canManageFinances && (
              <Link href="/federation/admin/cotisations">
                <Button className="w-full justify-start bg-green-400/10 text-green-400 hover:bg-green-400/20">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Gérer les cotisations
                </Button>
              </Link>
            )}
            {canManageWebsite && (
              <>
                <Link href="/federation/admin/livestreams">
                  <Button className="w-full justify-start bg-red-400/10 text-red-400 hover:bg-red-400/20">
                    <Radio className="w-4 h-4 mr-2" />
                    Lancer un direct
                  </Button>
                </Link>
                <Link href="/federation/admin/website">
                  <Button className="w-full justify-start bg-blue-400/10 text-blue-400 hover:bg-blue-400/20">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Modifier le site
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications - for Secrétaire Général and Président */}
        {canManageApplications && (
          <Card className="glass-card border-border/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">Candidatures récentes</CardTitle>
              <Link href="/federation/admin/applications">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div>
                      <p className="font-medium text-sm">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.date}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        app.status === "pending"
                          ? "border-yellow-500/50 text-yellow-400"
                          : "border-blue-500/50 text-blue-400"
                      }
                    >
                      {app.status === "pending" ? "En attente" : "En révision"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Cotisations - for Trésorière and Président */}
        {canManageFinances && (
          <Card className="glass-card border-border/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">Cotisations récentes</CardTitle>
              <Link href="/federation/admin/cotisations">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCotisations.map((cot) => (
                  <div
                    key={cot.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div>
                      <p className="font-medium text-sm">{cot.association}</p>
                      <p className="text-xs text-muted-foreground">{cot.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(cot.amount)}</p>
                      <Badge
                        variant="outline"
                        className={
                          cot.status === "paid"
                            ? "border-green-500/50 text-green-400"
                            : cot.status === "pending"
                            ? "border-yellow-500/50 text-yellow-400"
                            : "border-red-500/50 text-red-400"
                        }
                      >
                        {cot.status === "paid"
                          ? "Payé"
                          : cot.status === "pending"
                          ? "En attente"
                          : "En retard"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
