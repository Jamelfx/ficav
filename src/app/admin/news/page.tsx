"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DataTable } from "@/components/admin/DataTable";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  isPublished: boolean;
  createdAt: string;
}

export default function NewsAdminPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      setNews(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les actualités",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) return;

    try {
      const response = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setNews(news.filter((n) => n.id !== id));
      toast({
        title: "Succès",
        description: "Actualité supprimée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'actualité",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      header: "Titre",
      accessorKey: "title",
      cell: (row: News) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.title}</p>
          <p className="text-xs text-muted-foreground truncate">{row.excerpt}</p>
        </div>
      ),
    },
    {
      header: "Statut",
      accessorKey: "isPublished",
      cell: (row: News) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.isPublished
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {row.isPublished ? "Publié" : "Brouillon"}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (row: News) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
    },
    {
      header: "Actions",
      cell: (row: News) => (
        <div className="flex gap-2">
          <Link href={`/admin/news/${row.id}`}>
            <Button size="sm" variant="outline" className="h-8">
              <Edit2 size={14} />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-red-600 hover:text-red-700"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={14} />
          </Button>
          <Link href={`/news/${row.slug}`} target="_blank">
            <Button size="sm" variant="outline" className="h-8">
              <Eye size={14} />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-display font-semibold">Actualités</h1>
              <p className="text-muted-foreground mt-1">Gérez vos actualités et news</p>
            </div>
            <Link href="/admin/news/new">
              <Button className="gap-2">
                <Plus size={18} />
                Nouvelle actualité
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Chargement...
              </div>
            ) : news.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Aucune actualité. Commencez par en créer une !
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Titre</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Statut</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{item.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.excerpt}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.isPublished ? "Publié" : "Brouillon"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/news/${item.id}`}>
                              <Button size="sm" variant="outline" className="h-8">
                                <Edit2 size={14} />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                            <Link href={`/news/${item.slug}`} target="_blank">
                              <Button size="sm" variant="outline" className="h-8">
                                <Eye size={14} />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
