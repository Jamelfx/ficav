"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Film,
  Users,
  Building2,
  Clapperboard,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  FileSpreadsheet,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FederationNav } from "@/components/federation/FederationNav";
import { FederationFooter } from "@/components/federation/FederationFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface StatisticsData {
  metrics: {
    totalFilms: number;
    totalTechnicians: number;
    totalAssociations: number;
    annualProductions: number;
    growth: {
      films: number;
      technicians: number;
      associations: number;
      productions: number;
    };
  };
  charts: {
    yearlyProduction: Array<{ year: number; films: number }>;
    genreDistribution: Array<{ name: string; value: number; color: string }>;
    regionalDistribution: Array<{
      region: string;
      productions: number;
      technicians: number;
      associations: number;
    }>;
  };
  yearRange: {
    min: number;
    max: number;
  };
}

export default function StatistiquesPage() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const response = await fetch("/api/statistics");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStatistics();
  }, []);

  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF
    alert("Export PDF - Cette fonctionnalité sera bientôt disponible");
  };

  const handleExportCSV = () => {
    if (!data) return;

    // Create CSV content
    const csvContent = [
      "Année,Films produits",
      ...data.charts.yearlyProduction.map((row) => `${row.year},${row.films}`),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ficav_statistiques.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <FederationNav />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4">
              Statistiques du Cinéma Ivoirien
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez les chiffres clés et l&apos;évolution de l&apos;industrie
              cinématographique ivoirienne
            </p>
          </motion.div>

          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : data ? (
            <>
              {/* Key Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              >
                <MetricCard
                  title="Films Produits"
                  value={data.metrics.totalFilms}
                  growth={data.metrics.growth.films}
                  icon={<Film className="w-6 h-6" />}
                />
                <MetricCard
                  title="Techniciens Enregistrés"
                  value={data.metrics.totalTechnicians}
                  growth={data.metrics.growth.technicians}
                  icon={<Users className="w-6 h-6" />}
                />
                <MetricCard
                  title="Associations Membres"
                  value={data.metrics.totalAssociations}
                  growth={data.metrics.growth.associations}
                  icon={<Building2 className="w-6 h-6" />}
                />
                <MetricCard
                  title="Productions 2024"
                  value={data.metrics.annualProductions}
                  growth={data.metrics.growth.productions}
                  icon={<Clapperboard className="w-6 h-6" />}
                />
              </motion.div>

              {/* Export Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Exporter en PDF
                </Button>
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Exporter en CSV
                </Button>
              </motion.div>

              {/* Charts Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Tabs defaultValue="production" className="space-y-6">
                  <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                    <TabsTrigger value="production" className="gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Production
                    </TabsTrigger>
                    <TabsTrigger value="genres" className="gap-2">
                      <PieChartIcon className="w-4 h-4" />
                      Genres
                    </TabsTrigger>
                    <TabsTrigger value="regions" className="gap-2">
                      <Calendar className="w-4 h-4" />
                      Régions
                    </TabsTrigger>
                  </TabsList>

                  {/* Production Tab */}
                  <TabsContent value="production">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Films Produits par Année
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.charts.yearlyProduction}>
                              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.02 260)" />
                              <XAxis
                                dataKey="year"
                                stroke="oklch(0.65 0.02 70)"
                                fontSize={12}
                              />
                              <YAxis
                                stroke="oklch(0.65 0.02 70)"
                                fontSize={12}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "oklch(0.16 0.012 260)",
                                  border: "1px solid oklch(0.30 0.02 260)",
                                  borderRadius: "8px",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="films"
                                stroke="oklch(0.70 0.18 45)"
                                strokeWidth={3}
                                dot={{ fill: "oklch(0.70 0.18 45)", strokeWidth: 2 }}
                                activeDot={{
                                  r: 8,
                                  fill: "oklch(0.70 0.18 45)",
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Genres Tab */}
                  <TabsContent value="genres">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChartIcon className="w-5 h-5 text-primary" />
                          Distribution par Genre
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data.charts.genreDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) =>
                                  `${name} ${(percent * 100).toFixed(0)}%`
                                }
                              >
                                {data.charts.genreDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "oklch(0.16 0.012 260)",
                                  border: "1px solid oklch(0.30 0.02 260)",
                                  borderRadius: "8px",
                                }}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Regions Tab */}
                  <TabsContent value="regions">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Distribution Régionale
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={data.charts.regionalDistribution}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.02 260)" />
                              <XAxis
                                type="number"
                                stroke="oklch(0.65 0.02 70)"
                                fontSize={12}
                              />
                              <YAxis
                                type="category"
                                dataKey="region"
                                stroke="oklch(0.65 0.02 70)"
                                fontSize={12}
                                width={100}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "oklch(0.16 0.012 260)",
                                  border: "1px solid oklch(0.30 0.02 260)",
                                  borderRadius: "8px",
                                }}
                              />
                              <Legend />
                              <Bar
                                dataKey="productions"
                                name="Productions"
                                fill="oklch(0.70 0.18 45)"
                                radius={[0, 4, 4, 0]}
                              />
                              <Bar
                                dataKey="technicians"
                                name="Techniciens"
                                fill="oklch(0.60 0.15 150)"
                                radius={[0, 4, 4, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Regional Stats Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8"
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Détails par Région</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                              Région
                            </th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                              Productions
                            </th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                              Techniciens
                            </th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                              Associations
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.charts.regionalDistribution.map((region, index) => (
                            <tr
                              key={region.region}
                              className={`border-b border-border/50 ${
                                index % 2 === 0 ? "bg-muted/20" : ""
                              }`}
                            >
                              <td className="py-3 px-4 font-medium">
                                {region.region}
                              </td>
                              <td className="py-3 px-4 text-right tabular-nums">
                                {region.productions}
                              </td>
                              <td className="py-3 px-4 text-right tabular-nums">
                                {region.technicians}
                              </td>
                              <td className="py-3 px-4 text-right tabular-nums">
                                {region.associations}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Impossible de charger les statistiques
              </p>
            </div>
          )}
        </div>
      </main>

      <FederationFooter />
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  growth,
  icon,
}: {
  title: string;
  value: number;
  growth: number;
  icon: React.ReactNode;
}) {
  const isPositive = growth >= 0;

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(growth).toFixed(1)}%
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold tabular-nums">
            {value.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
