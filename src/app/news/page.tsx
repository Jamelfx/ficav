import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Navigation, Footer } from "@/components/ficav";
import Image from "next/image";

export const revalidate = 60; // Revalidate toutes les 60s

export default async function NewsPage() {
  let news = [];
  
  try {
    news = await db.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error("Erreur pour charger les actualités:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-12">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Actualités FICAV
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Découvrez les dernières nouvelles de l'industrie cinématographique ivoirienne
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {news.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Aucune actualité pour le moment. Revenez bientôt !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <article className="group cursor-pointer h-full">
                      <div className="relative h-48 bg-muted rounded-lg overflow-hidden mb-4">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <span className="text-muted-foreground">Pas d'image</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        
                        {item.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.publishedAt || item.createdAt).toLocaleDateString("fr-FR")}
                          </span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
