"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Film {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  year: number;
  genre: string;
  isPublished: boolean;
}

export default function FilmsAdminPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/films");
      if (!response.ok) throw new Error("Failed to fetch films");
      const data = await response.json();
      setFilms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les films",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce film ?")) return;

    try {
      const response = await fetch(`/api/films/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setFilms(films.filter((f) => f.id !== id));
      toast({
        title: "Succès",
        description: "Film supprimé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le film",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-display font-semibold">Films</h1>
              <p className="text-muted-foreground mt-1">Gérez la base de données des films ivoiriens</p>
            </div>
            <Link href="/admin/films/new">
              <Button className="gap-2">
                <Plus size={18} />
                Nouveau film
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Chargement...
              </div>
            ) : films.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Aucun film. Commencez par en ajouter un !
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Titre</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Année</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Genre</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Statut</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {films.map((film) => (
                      <tr key={film.id} className="border-b hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{film.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {film.synopsis}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{film.year}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            {film.genre || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            film.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {film.isPublished ? "Publié" : "Brouillon"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/films/${film.id}`}>
                              <Button size="sm" variant="outline" className="h-8">
                                <Edit2 size={14} />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(film.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                            <Link href={`/films/${film.slug}`} target="_blank">
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
