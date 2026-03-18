"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Eye, MoreVertical, CheckCircle, Clock, XCircle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Association {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  status: string;
  president: string;
  _count?: { members: number };
}

export default function AdminAssociationsPage() {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/associations")
      .then((res) => res.json())
      .then((data) => {
        setAssociations(data.associations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredAssociations = associations.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Active</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">En attente</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Suspendue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-semibold">Associations</h1>
              <p className="text-muted-foreground mt-1">Gérer les associations membres de la FICAV</p>
            </div>
            <Button className="gap-2">
              <Plus size={16} />
              Nouvelle association
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Rechercher par nom, catégorie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nom</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Catégorie</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Président</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ville</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Statut</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Membres</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {Array(7).fill(0).map((_, j) => (
                          <td key={j} className="p-4"><div className="h-4 bg-secondary rounded shimmer" /></td>
                        ))}
                      </tr>
                    ))
                  ) : filteredAssociations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        Aucune association trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredAssociations.map((association) => (
                      <motion.tr
                        key={association.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-medium">{association.name}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{association.category || "-"}</td>
                        <td className="p-4 text-muted-foreground">{association.president || "-"}</td>
                        <td className="p-4 text-muted-foreground">{association.city || "-"}</td>
                        <td className="p-4">{getStatusBadge(association.status)}</td>
                        <td className="p-4 tabular-nums">{association._count?.members || 0}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye size={14} className="mr-2" /> Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit size={14} className="mr-2" /> Modifier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
