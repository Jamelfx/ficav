import { db } from "@/lib/db";
import { Navigation, Footer } from "@/components/ficav";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const revalidate = 3600; // Revalidate toutes les heures

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const news = await db.news.findUnique({
    where: { slug: params.slug },
  });

  if (!news) return {};

  return {
    title: news.title,
    description: news.excerpt || news.content.substring(0, 160),
    openGraph: {
      title: news.title,
      description: news.excerpt || news.content.substring(0, 160),
      images: news.image ? [news.image] : [],
    },
  };
}

export async function generateStaticParams() {
  const news = await db.news.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });

  return news.map((item) => ({
    slug: item.slug,
  }));
}

export default async function NewsDetailPage({ params }: Props) {
  const news = await db.news.findUnique({
    where: { slug: params.slug },
  });

  if (!news || !news.isPublished) {
    notFound();
  }

  const relatedNews = await db.news.findMany({
    where: {
      isPublished: true,
      slug: { not: params.slug },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-8">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Link href="/news">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft size={16} />
                Retour aux actualités
              </Button>
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Meta */}
            <div className="mb-6">
              <time className="text-sm text-muted-foreground">
                {new Date(news.publishedAt || news.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {news.title}
            </h1>

            {/* Featured Image */}
            {news.image && (
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-8">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  quality={85}
                  className="object-cover"
                />
              </div>
            )}

            {/* Excerpt */}
            {news.excerpt && (
              <p className="text-lg text-muted-foreground italic mb-8 p-6 bg-muted/50 rounded-lg border-l-4 border-primary">
                {news.excerpt}
              </p>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-12">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => <h2 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                  h2: ({ ...props }) => <h3 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                  h3: ({ ...props }) => <h4 className="text-xl font-bold mt-4 mb-2" {...props} />,
                  p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                  a: ({ ...props }) => (
                    <a className="text-primary hover:underline" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside mb-4" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside mb-4" {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
                  ),
                  code: ({ ...props }) => (
                    <code className="bg-muted px-2 py-1 rounded text-sm" {...props} />
                  ),
                }}
              >
                {news.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold mb-8">Actualités connexes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <article className="group cursor-pointer">
                      <div className="relative h-40 bg-muted rounded-lg overflow-hidden mb-3">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20" />
                        )}
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
