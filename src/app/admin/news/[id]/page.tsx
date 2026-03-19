"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ImageUpload } from "@/components/common/image-upload";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface NewsForm {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  isPublished: boolean;
}

export default function NewsFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";
  const { toast } = useToast();

  const [form, setForm] = useState<NewsForm>({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    isPublished: false,
  });
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchNews();
    }
  }, [id, isNew]);

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news/${id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setForm(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'actualité",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const method = isNew ? "POST" : "PATCH";
      const url = isNew ? "/api/news" : `/api/news/${id}`;
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save");
      
      toast({
        title: "Succès",
        description: isNew ? "Actualité créée" : "Actualité mise à jour",
      });
      
      router.push("/admin/news");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'actualité",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/news">
            <Button variant="outline" size="sm" className="mb-6 gap-2">
              <ArrowLeft size={16} />
              Retour
            </Button>
          </Link>

          <div className="max-w-2xl">
            <h1 className="text-3xl font-display font-semibold mb-2">
              {isNew ? "Nouvelle actualité" : "Modifier l'actualité"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isNew
                ? "Créez une nouvelle actualité pour votre site"
                : "Mettez à jour les informations de cette actualité"}
            </p>

            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Titre *
                  </label>
                  <Input
                    type="text"
                    placeholder="Titre de l'actualité"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Résumé
                  </label>
                  <Textarea
                    placeholder="Résumé court de l'actualité"
                    value={form.excerpt}
                    onChange={(e) =>
                      setForm({ ...form, excerpt: e.target.value })
                    }
                    rows={2}
                  />
                </div>

                {/* Image Upload */}
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  label="Image de l'actualité"
                  hint="JPG, PNG, WebP, GIF (max 10MB)"
                />

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contenu *
                  </label>
                  <Textarea
                    placeholder="Contenu principal de l'actualité (Markdown supporté)"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    rows={10}
                    required
                  />
                </div>

                {/* Published */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({ ...form, isPublished: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="published" className="text-sm font-medium cursor-pointer">
                    Publier cette actualité
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                  <Link href="/admin/news" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Annuler
                    </Button>
                  </Link>
                </div>
              </form>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
