"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Eye, MoreVertical, Shield, User, UserCheck } from "lucide-react";
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

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_ASSOCIATION: "Admin Association",
  PROFESSIONAL: "Professionnel",
  VISITOR: "Visiteur",
};

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-red-500/20 text-red-400",
  ADMIN_ASSOCIATION: "bg-purple-500/20 text-purple-400",
  PROFESSIONAL: "bg-blue-500/20 text-blue-400",
  VISITOR: "bg-gray-500/20 text-gray-400",
};

// Sample users for demo
const sampleUsers: UserItem[] = [
  { id: "1", name: "Admin FICAV", email: "admin@ficav.ci", role: "SUPER_ADMIN", isVerified: true },
  { id: "2", name: "Philippe Koffi", email: "philippe@ficav.ci", role: "PROFESSIONAL", isVerified: true },
  { id: "3", name: "Marie Touré", email: "marie@ficav.ci", role: "PROFESSIONAL", isVerified: true },
  { id: "4", name: "Ibrahim Koné", email: "ibrahim@ficav.ci", role: "ADMIN_ASSOCIATION", isVerified: true },
  { id: "5", name: "Didier Kouamé", email: "didier@ficav.ci", role: "PROFESSIONAL", isVerified: false },
];

export default function AdminUsersPage() {
  const [users] = useState<UserItem[]>(sampleUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-semibold">Utilisateurs</h1>
              <p className="text-muted-foreground mt-1">Gérer les utilisateurs de la plateforme</p>
            </div>
            <Button className="gap-2">
              <Plus size={16} />
              Nouvel utilisateur
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Rechercher par nom, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nom</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rôle</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Statut</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User size={14} className="text-primary" />
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{user.email}</td>
                      <td className="p-4">
                        <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                      </td>
                      <td className="p-4">
                        {user.isVerified ? (
                          <Badge className="bg-green-500/20 text-green-400">
                            <UserCheck size={12} className="mr-1" /> Vérifié
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Non vérifié</Badge>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye size={14} className="mr-2" /> Voir</DropdownMenuItem>
                            <DropdownMenuItem><Edit size={14} className="mr-2" /> Modifier</DropdownMenuItem>
                            <DropdownMenuItem><Shield size={14} className="mr-2" /> Changer rôle</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
