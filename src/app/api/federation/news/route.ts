import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - List all news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const featured = searchParams.get("featured");

    if (!db.news) {
      // Return sample data
      return NextResponse.json([
        {
          id: "sample-1",
          slug: "fespaco-2024",
          title: "FESPACO 2024: Le cinéma ivoirien en force",
          excerpt: "La délégation ivoirienne revient du FESPACO avec 5 prix prestigieux, confirmant la vitalité de notre cinéma.",
          content: "La délégation ivoirienne a brillé lors de cette édition du FESPACO...",
          image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=600&fit=crop",
          isFeatured: true,
          isPublished: true,
          publishedAt: new Date("2024-03-10").toISOString(),
        },
        {
          id: "sample-2",
          slug: "nouveau-financement",
          title: "Nouveau fonds de financement pour le cinéma",
          excerpt: "Le gouvernement ivoirien annonce un fonds de 2 milliards FCFA pour soutenir la production.",
          content: "Un nouveau fonds de financement a été annoncé...",
          image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop",
          isFeatured: false,
          isPublished: true,
          publishedAt: new Date("2024-04-15").toISOString(),
        },
        {
          id: "sample-3",
          slug: "formation-netflix",
          title: "Partenariat FICAV-Netflix pour la formation",
          excerpt: "Netflix s'engage à former 100 techniciens ivoiriens d'ici 2025.",
          content: "Un partenariat stratégique a été signé avec Netflix...",
          image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=300&fit=crop",
          isFeatured: false,
          isPublished: true,
          publishedAt: new Date("2024-05-01").toISOString(),
        },
      ]);
    }

    const where: { isPublished?: boolean; isFeatured?: boolean } = {};
    
    if (featured === "true") {
      where.isFeatured = true;
      where.isPublished = true;
    } else if (featured === "false") {
      where.isPublished = true;
    }

    const news = await db.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await db.news.count({ where });

    return NextResponse.json({
      news,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json([]);
  }
}

// POST - Create news article
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!db.news) {
      return NextResponse.json({
        ...data,
        id: `news-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }

    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const news = await db.news.create({
      data: {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        isPublished: data.isPublished ?? true,
        isFeatured: data.isFeatured ?? false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'article" },
      { status: 500 }
    );
  }
}

// PUT - Update news article
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!db.news || !data.id) {
      return NextResponse.json(data);
    }

    const news = await db.news.update({
      where: { id: data.id },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'article" },
      { status: 500 }
    );
  }
}

// DELETE - Delete news article
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    if (!db.news) {
      return NextResponse.json({ success: true });
    }

    await db.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}
