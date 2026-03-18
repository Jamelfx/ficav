"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ExpenseCategory,
  ExpenseStatus,
  Expense,
  ExpenseDocument,
} from "@prisma/client";
import { useAuth } from "@/lib/auth-context";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Upload,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileUp,
  Building2,
  Car,
  Tv,
  GraduationCap,
  Package,
  Home,
  Zap,
  Briefcase,
  MoreHorizontal,
  Send,
  Printer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

// Types
type ExpenseWithDocuments = Expense & {
  documents: ExpenseDocument[];
};

type Statistics = {
  year: number;
  summary: {
    totalExpenses: number;
    totalAmount: number;
    totalIncome: number;
    balance: number;
    averagePerMonth: number;
  };
  charts: {
    monthly: Array<{ month: string; monthIndex: number; amount: number; count: number }>;
    byCategory: Array<{ category: string; categoryKey: string; amount: number; fill: string }>;
    byStatus: Array<{ status: string; statusKey: string; count: number }>;
    quarterly: Array<{ quarter: string; amount: number; count: number }>;
    comparison: Array<{ month: string; expenses: number; income: number }>;
  };
  topExpenses: Array<{
    id: string;
    reference: string;
    title: string;
    amount: number;
    date: Date;
    category: string;
  }>;
};

// Category config
const categoryConfig: Record<ExpenseCategory, { label: string; icon: React.ElementType; color: string }> = {
  ADMINISTRATIVE: { label: "Administratif", icon: Building2, color: "#6366f1" },
  EVENT: { label: "Événements", icon: Calendar, color: "#f59e0b" },
  EQUIPMENT: { label: "Équipements", icon: Package, color: "#10b981" },
  COMMUNICATION: { label: "Communication", icon: Tv, color: "#3b82f6" },
  TRANSPORT: { label: "Transport", icon: Car, color: "#8b5cf6" },
  FORMATION: { label: "Formation", icon: GraduationCap, color: "#ec4899" },
  LOGISTICS: { label: "Logistique", icon: Package, color: "#14b8a6" },
  SALARY: { label: "Salaires", icon: Briefcase, color: "#f97316" },
  RENT: { label: "Loyer", icon: Home, color: "#64748b" },
  UTILITIES: { label: "Factures", icon: Zap, color: "#0ea5e9" },
  SUPPLIES: { label: "Fournitures", icon: Package, color: "#84cc16" },
  OTHER: { label: "Autres", icon: MoreHorizontal, color: "#a1a1aa" },
};

// Status config
const statusConfig: Record<ExpenseStatus, { label: string; color: string; bgColor: string }> = {
  DRAFT: { label: "Brouillon", color: "text-gray-400", bgColor: "bg-gray-500/10 border-gray-500/20" },
  PENDING_APPROVAL: { label: "En attente", color: "text-yellow-400", bgColor: "bg-yellow-500/10 border-yellow-500/20" },
  APPROVED: { label: "Approuvé", color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20" },
  REJECTED: { label: "Rejeté", color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/20" },
  PAID: { label: "Payé", color: "text-green-400", bgColor: "bg-green-500/10 border-green-500/20" },
};

// Payment methods
const paymentMethods = [
  { value: "cash", label: "Espèces" },
  { value: "bank_transfer", label: "Virement bancaire" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "check", label: "Chèque" },
  { value: "card", label: "Carte bancaire" },
];

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b", "#0ea5e9", "#84cc16", "#a1a1aa"];

export default function DepensesPage() {
  const { user } = useAuth();
  const isTresoriere = user?.role === "TRESORIERE";
  const [expenses, setExpenses] = useState<ExpenseWithDocuments[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  
  // Dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithDocuments | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "OTHER" as ExpenseCategory,
    expenseDate: new Date().toISOString().split("T")[0],
    paymentDate: "",
    beneficiary: "",
    beneficiaryType: "supplier",
    paymentMethod: "",
    budgetLine: "",
    eventName: "",
  });

  // Documents
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const params = new URLSearchParams();
      if (yearFilter) params.append("year", yearFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/expenses?${params.toString()}`);
      const data = await response.json();
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Erreur lors du chargement des dépenses");
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/expenses/statistics?year=${yearFilter}`);
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchStatistics();
  }, [yearFilter, categoryFilter, statusFilter, searchQuery]);

  // Create expense
  const handleCreateExpense = async () => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Dépense créée avec succès");
        setIsAddDialogOpen(false);
        resetForm();
        fetchExpenses();
        fetchStatistics();
      } else {
        toast.error("Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  // Update expense status
  const handleUpdateStatus = async (id: string, status: ExpenseStatus) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success("Statut mis à jour");
        fetchExpenses();
        fetchStatistics();
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) return;
    
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Dépense supprimée");
        fetchExpenses();
        fetchStatistics();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Upload document
  const handleUploadDocument = async (expenseId: string, file: File, documentType: string) => {
    setUploadingDoc(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("title", file.name);
      formDataObj.append("documentType", documentType);

      const response = await fetch(`/api/expenses/${expenseId}/documents`, {
        method: "POST",
        body: formDataObj,
      });

      if (response.ok) {
        toast.success("Document téléchargé");
        fetchExpenses();
      }
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setUploadingDoc(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      amount: "",
      category: "OTHER",
      expenseDate: new Date().toISOString().split("T")[0],
      paymentDate: "",
      beneficiary: "",
      beneficiaryType: "supplier",
      paymentMethod: "",
      budgetLine: "",
      eventName: "",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "dd MMM yyyy", { locale: fr });
  };

  // Generate report
  const generateReport = (type: string) => {
    // In a real app, this would generate a PDF
    toast.success(`Rapport ${type} généré avec succès`);
    setIsReportDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
            Gestion des Dépenses
          </h1>
          <p className="text-muted-foreground">
            Comptabilité et suivi financier de la Fédération
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsReportDialogOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Rapports
          </Button>
          {isTresoriere && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Dépense
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Dépenses",
            value: formatCurrency(statistics?.summary.totalAmount || 0),
            icon: TrendingDown,
            color: "text-red-400",
            bgColor: "bg-red-500/10",
          },
          {
            label: "Total Recettes",
            value: formatCurrency(statistics?.summary.totalIncome || 0),
            icon: TrendingUp,
            color: "text-green-400",
            bgColor: "bg-green-500/10",
          },
          {
            label: "Solde",
            value: formatCurrency(statistics?.summary.balance || 0),
            icon: DollarSign,
            color: (statistics?.summary.balance || 0) >= 0 ? "text-green-400" : "text-red-400",
            bgColor: (statistics?.summary.balance || 0) >= 0 ? "bg-green-500/10" : "bg-red-500/10",
          },
          {
            label: "Nb Dépenses",
            value: statistics?.summary.totalExpenses || 0,
            icon: Receipt,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
          },
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
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Mensuel</span>
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            <span className="hidden sm:inline">Catégories</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Recettes/Dépenses</span>
          </TabsTrigger>
          <TabsTrigger value="quarterly" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Trimestriel</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display">Dépenses mensuelles</CardTitle>
              <CardDescription>Évolution des dépenses au cours de l&apos;année {yearFilter}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistics?.charts.monthly || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                      formatter={(value) => [formatCurrency(Number(value)), "Montant"]}
                    />
                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display">Par catégorie</CardTitle>
                <CardDescription>Répartition des dépenses par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={statistics?.charts.byCategory || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="amount"
                        nameKey="category"
                        label={({ category, percent }) => `${category} (${((percent || 0) * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {(statistics?.charts.byCategory || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                        formatter={(value) => [formatCurrency(Number(value)), "Montant"]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="font-display">Détail par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(statistics?.charts.byCategory || [])
                    .sort((a, b) => b.amount - a.amount)
                    .map((cat, index) => (
                      <div key={cat.categoryKey} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.fill }}
                          />
                          <span className="text-sm">{cat.category}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(cat.amount)}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display">Recettes vs Dépenses</CardTitle>
              <CardDescription>Comparaison des entrées et sorties d&apos;argent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statistics?.charts.comparison || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                      formatter={(value) => [formatCurrency(Number(value))]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="income" name="Recettes" stroke="#10b981" fill="#10b98133" />
                    <Area type="monotone" dataKey="expenses" name="Dépenses" stroke="#ef4444" fill="#ef444433" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarterly">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="font-display">Dépenses trimestrielles</CardTitle>
              <CardDescription>Vue trimestrielle des dépenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistics?.charts.quarterly || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                      formatter={(value) => [formatCurrency(Number(value)), "Montant"]}
                    />
                    <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Filters */}
      <Card className="glass-card border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une dépense..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-32 bg-background/50">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {[2025, 2024, 2023, 2022].map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-background/50">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {Object.entries(categoryConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <Card className="glass-card border-border/30">
            <CardContent className="p-8 text-center">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune dépense trouvée</p>
              {isTresoriere && (
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une dépense
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          expenses.map((expense, index) => {
            const status = statusConfig[expense.status];
            const category = categoryConfig[expense.category];
            
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card border-border/30 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <category.icon className="w-6 h-6" style={{ color: category.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground font-mono">
                              {expense.reference}
                            </span>
                            <Badge variant="outline" className={status.bgColor}>
                              {status.label}
                            </Badge>
                          </div>
                          <h3 className="font-display font-bold text-foreground mt-1">
                            {expense.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{formatCurrency(expense.amount)}</span>
                            <span>•</span>
                            <span>{formatDate(expense.expenseDate)}</span>
                            {expense.beneficiary && (
                              <>
                                <span>•</span>
                                <span>{expense.beneficiary}</span>
                              </>
                            )}
                          </div>
                          {expense.documents.length > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <FileText className="w-3 h-3" />
                              {expense.documents.length} justificatif(s)
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {isTresoriere && expense.status === "DRAFT" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(expense.id, "PENDING_APPROVAL")}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Soumettre
                          </Button>
                        )}
                        {isTresoriere && expense.status === "PENDING_APPROVAL" && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-500/90"
                            onClick={() => handleUpdateStatus(expense.id, "APPROVED")}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                        )}
                        {isTresoriere && expense.status === "APPROVED" && (
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-500/90"
                            onClick={() => handleUpdateStatus(expense.id, "PAID")}
                          >
                            <DollarSign className="w-4 h-4 mr-1" />
                            Marquer payée
                          </Button>
                        )}
                        {isTresoriere && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Nouvelle Dépense</DialogTitle>
            <DialogDescription>
              Enregistrez une nouvelle dépense avec ses justificatifs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Informations générales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Titre / Description *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Achat matériel de bureau"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (XOF) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Ex: 150000"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v as ExpenseCategory })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenseDate">Date de la dépense *</Label>
                  <Input
                    id="expenseDate"
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Date de paiement</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            {/* Beneficiary */}
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Bénéficiaire
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beneficiary">Nom du bénéficiaire</Label>
                  <Input
                    id="beneficiary"
                    value={formData.beneficiary}
                    onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
                    placeholder="Ex: Fournisseur XYZ"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Mode de paiement</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((pm) => (
                        <SelectItem key={pm.value} value={pm.value}>{pm.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Informations complémentaires
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetLine">Ligne budgétaire</Label>
                  <Input
                    id="budgetLine"
                    value={formData.budgetLine}
                    onChange={(e) => setFormData({ ...formData, budgetLine: e.target.value })}
                    placeholder="Ex: Fonctionnement"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventName">Événement associé</Label>
                  <Input
                    id="eventName"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    placeholder="Ex: FESTIC 2025"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Notes / Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Détails supplémentaires sur cette dépense..."
                    className="bg-background/50 min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateExpense} disabled={!formData.title || !formData.amount}>
              <Receipt className="w-4 h-4 mr-2" />
              Enregistrer la dépense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Expense Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Détails de la dépense</DialogTitle>
            <DialogDescription>
              {selectedExpense?.reference}
            </DialogDescription>
          </DialogHeader>

          {selectedExpense && (
            <div className="space-y-6 mt-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Titre</Label>
                  <p className="font-medium">{selectedExpense.title}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Montant</Label>
                  <p className="font-bold text-lg">{formatCurrency(selectedExpense.amount)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Catégorie</Label>
                  <p>{categoryConfig[selectedExpense.category]?.label}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Statut</Label>
                  <Badge variant="outline" className={statusConfig[selectedExpense.status].bgColor}>
                    {statusConfig[selectedExpense.status].label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p>{formatDate(selectedExpense.expenseDate)}</p>
                </div>
                {selectedExpense.beneficiary && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Bénéficiaire</Label>
                    <p>{selectedExpense.beneficiary}</p>
                  </div>
                )}
              </div>

              {selectedExpense.description && (
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm mt-1">{selectedExpense.description}</p>
                </div>
              )}

              {/* Documents */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">Justificatifs</Label>
                
                {selectedExpense.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedExpense.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm">{doc.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {doc.documentType}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun justificatif</p>
                )}

                {/* Upload new document */}
                <div className="border-2 border-dashed border-border/50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="doc-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadDocument(selectedExpense.id, file, "invoice");
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("doc-upload")?.click()}
                      disabled={uploadingDoc}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Ajouter un justificatif
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      PDF, JPG, PNG acceptés
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
            <Button variant="outline" asChild>
              <a href={`/api/expenses/${selectedExpense?.id}/report`} target="_blank">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="glass-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Générer un rapport</DialogTitle>
            <DialogDescription>
              Exportez les données financières pour l&apos;assemblée ou les commissaires aux comptes
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              variant="outline"
              className="h-24 flex-col"
              onClick={() => generateReport("mensuel")}
            >
              <Calendar className="w-6 h-6 mb-2" />
              Rapport mensuel
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col"
              onClick={() => generateReport("trimestriel")}
            >
              <BarChart3 className="w-6 h-6 mb-2" />
              Rapport trimestriel
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col"
              onClick={() => generateReport("annuel")}
            >
              <FileText className="w-6 h-6 mb-2" />
              Rapport annuel
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col"
              onClick={() => generateReport("audit")}
            >
              <PieChart className="w-6 h-6 mb-2" />
              Rapport d&apos;audit
            </Button>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 Les rapports sont générés au format PDF et incluent tous les justificatifs attachés aux dépenses.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
