"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Upload,
  UserPlus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock members data
const membersData = [
  {
    id: "1",
    name: "Kouadio Jean-Baptiste",
    email: "kouadio.jb@email.com",
    phone: "+225 07 01 02 03 04",
    role: "Acteur",
    specialty: "Cinéma dramatique",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2025-01-12",
    cotisation: "paid",
  },
  {
    id: "2",
    name: "Aya Marie-Claire",
    email: "aya.mc@email.com",
    phone: "+225 07 02 03 04 05",
    role: "Actrice",
    specialty: "Comédie",
    status: "active",
    joinDate: "2024-02-20",
    lastActive: "2025-01-11",
    cotisation: "paid",
  },
  {
    id: "3",
    name: "Yao Koffi",
    email: "yao.koffi@email.com",
    phone: "+225 07 03 04 05 06",
    role: "Réalisateur",
    specialty: "Documentaire",
    status: "active",
    joinDate: "2024-03-10",
    lastActive: "2025-01-10",
    cotisation: "pending",
  },
  {
    id: "4",
    name: "Diallo Amadou",
    email: "diallo.amadou@email.com",
    phone: "+225 07 04 05 06 07",
    role: "Technicien",
    specialty: "Son",
    status: "pending",
    joinDate: "2024-12-05",
    lastActive: "2025-01-08",
    cotisation: "unpaid",
  },
  {
    id: "5",
    name: "Koné Fatou",
    email: "kone.fatou@email.com",
    phone: "+225 07 05 06 07 08",
    role: "Actrice",
    specialty: "Théâtre",
    status: "active",
    joinDate: "2024-04-25",
    lastActive: "2025-01-09",
    cotisation: "paid",
  },
  {
    id: "6",
    name: "Bamba Ibrahim",
    email: "bamba.ibrahim@email.com",
    phone: "+225 07 06 07 08 09",
    role: "Producteur",
    specialty: "Film institutionnel",
    status: "inactive",
    joinDate: "2023-06-15",
    lastActive: "2024-11-20",
    cotisation: "unpaid",
  },
  {
    id: "7",
    name: "Touré Aminata",
    email: "toure.aminata@email.com",
    phone: "+225 07 07 08 09 10",
    role: "Actrice",
    specialty: "Série TV",
    status: "active",
    joinDate: "2024-05-12",
    lastActive: "2025-01-12",
    cotisation: "paid",
  },
  {
    id: "8",
    name: "Coulibaly Moussa",
    email: "coulibaly.moussa@email.com",
    phone: "+225 07 08 09 10 11",
    role: "Réalisateur",
    specialty: "Fiction",
    status: "active",
    joinDate: "2024-06-08",
    lastActive: "2025-01-11",
    cotisation: "paid",
  },
];

const statusConfig = {
  active: { label: "Actif", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  pending: { label: "En attente", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  inactive: { label: "Inactif", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const cotisationConfig = {
  paid: { label: "À jour", icon: CheckCircle2, color: "text-green-400" },
  pending: { label: "En attente", icon: Clock, color: "text-yellow-400" },
  unpaid: { label: "En retard", icon: AlertCircle, color: "text-red-400" },
};

export default function MembresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cotisationFilter, setCotisationFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredMembers = membersData.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    const matchesCotisation = cotisationFilter === "all" || member.cotisation === cotisationFilter;

    return matchesSearch && matchesStatus && matchesCotisation;
  });

  const stats = {
    total: membersData.length,
    active: membersData.filter((m) => m.status === "active").length,
    pending: membersData.filter((m) => m.status === "pending").length,
    inactive: membersData.filter((m) => m.status === "inactive").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total membres", value: stats.total, icon: Users, color: "text-primary" },
          { label: "Actifs", value: stats.active, icon: CheckCircle2, color: "text-green-400" },
          { label: "En attente", value: stats.pending, icon: Clock, color: "text-yellow-400" },
          { label: "Inactifs", value: stats.inactive, icon: AlertCircle, color: "text-red-400" },
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
                    <p className="font-display text-3xl text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="font-display text-xl tracking-wider">
              Gestion des membres
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl">
                      Ajouter un membre
                    </DialogTitle>
                    <DialogDescription>
                      Remplissez les informations du nouveau membre
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Nom complet</Label>
                      <Input id="member-name" placeholder="Kouadio Jean-Baptiste" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-email">Email</Label>
                      <Input id="member-email" type="email" placeholder="email@exemple.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-phone">Téléphone</Label>
                      <Input id="member-phone" placeholder="+225 07 XX XX XX XX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-role">Rôle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acteur">Acteur / Actrice</SelectItem>
                          <SelectItem value="realisateur">Réalisateur</SelectItem>
                          <SelectItem value="producteur">Producteur</SelectItem>
                          <SelectItem value="technicien">Technicien</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => setIsAddDialogOpen(false)}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cotisationFilter} onValueChange={setCotisationFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50">
                <SelectValue placeholder="Cotisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="paid">À jour</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="unpaid">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Members Table */}
          <div className="rounded-xl border border-border/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Membre</TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Rôle</TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Statut</TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Cotisation</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member, index) => {
                  const cotisation = cotisationConfig[member.cotisation as keyof typeof cotisationConfig];
                  const status = statusConfig[member.status as keyof typeof statusConfig];
                  
                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-white/5"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-border/50">
                            <AvatarFallback className="bg-primary/20 text-primary text-sm">
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <p className="text-foreground">{member.role}</p>
                          <p className="text-xs text-muted-foreground">{member.specialty}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-1">
                          <p className="text-sm text-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {member.email}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className={`flex items-center gap-1 ${cotisation.color}`}>
                          <cotisation.icon className="w-4 h-4" />
                          <span className="text-sm">{cotisation.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Envoyer un email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Affichage de {filteredMembers.length} sur {membersData.length} membres
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
