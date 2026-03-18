"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Film, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ associations: 5, users: 1250, films: 85, events: 15 });

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-semibold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Bienvenue sur l'espace d'administration FICAV</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
            <StatCard title="Associations" value={stats.associations} icon={Building2} />
            <StatCard title="Utilisateurs" value={stats.users} icon={Users} />
            <StatCard title="Films" value={stats.films} icon={Film} />
            <StatCard title="Événements" value={stats.events} icon={Calendar} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
              <div className="space-y-3">
                <Link href="/admin/associations" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <span>Gérer les associations</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href="/admin/events" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <span>Gérer les événements</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href="/admin/cotisations" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <span>Voir les cotisations</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Cotisations 2024</h2>
              <div className="h-4 bg-secondary rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: "72%" }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">72% collecté</span>
                <span className="font-medium">1 800 000 FCFA</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <Icon size={24} className="text-primary mb-3" />
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}
