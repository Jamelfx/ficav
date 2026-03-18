import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - List all albums or specific album
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    if (!db.galleryAlbum) {
      // Return sample data
      return NextResponse.json([
        {
          id: "sample-1",
          title: "FESPACO 2024",
          description: "La délégation ivoirienne au FESPACO 2024 à Ouagadougou",
          slug: "fespaco-2024",
          coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop",
          order: 0,
          isPublished: true,
          photos: [
            { id: "p1", url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop", title: "Cérémonie d'ouverture" },
            { id: "p2", url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=600&fit=crop", title: "Projection" },
          ],
        },
        {
          id: "sample-2",
          title: "Assemblée Générale 2024",
          description: "L'assemblée générale annuelle de la FICAV",
          slug: "ag-2024",
          coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
          order: 1,
          isPublished: true,
          photos: [
            { id: "p3", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop", title: "Salle de réunion" },
          ],
        },
        {
          id: "sample-3",
          title: "Formation Réalisateurs",
          description: "Atelier de formation pour les réalisateurs",
          slug: "formation-realisateurs",
          coverImage: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&h=600&fit=crop",
          order: 2,
          isPublished: true,
          photos: [],
        },
      ]);
    }

    // Get specific album by slug or id
    if (slug) {
      const album = await db.galleryAlbum.findUnique({
        where: { slug },
        include: {
          photos: {
            orderBy: { order: "asc" },
          },
        },
      });
      return NextResponse.json(album);
    }

    if (id) {
      const album = await db.galleryAlbum.findUnique({
        where: { id },
        include: {
          photos: {
            orderBy: { order: "asc" },
          },
        },
      });
      return NextResponse.json(album);
    }

    // Get all albums
    const albums = await db.galleryAlbum.findMany({
      where: { isPublished: true },
      include: {
        photos: {
          orderBy: { order: "asc" },
          take: 5, // Only first 5 photos for preview
        },
        _count: {
          select: { photos: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json([]);
  }
}

// POST - Create new album
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!db.galleryAlbum) {
      return NextResponse.json({
        ...data,
        id: `album-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }

    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Get max order
    const maxOrder = await db.galleryAlbum.aggregate({
      _max: { order: true },
    });
    const order = (maxOrder._max.order || 0) + 1;

    const album = await db.galleryAlbum.create({
      data: {
        title: data.title,
        description: data.description,
        slug,
        coverImage: data.coverImage,
        order,
        isPublished: data.isPublished ?? true,
      },
    });

    // Add photos if provided
    if (data.photos && Array.isArray(data.photos) && db.galleryPhoto) {
      for (let i = 0; i < data.photos.length; i++) {
        await db.galleryPhoto.create({
          data: {
            title: data.photos[i].title,
            description: data.photos[i].description,
            url: data.photos[i].url,
            thumbnailUrl: data.photos[i].thumbnailUrl,
            order: i,
            albumId: album.id,
          },
        });
      }
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error("Error creating album:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'album" },
      { status: 500 }
    );
  }
}

// PUT - Update album
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!db.galleryAlbum || !data.id) {
      return NextResponse.json(data);
    }

    const album = await db.galleryAlbum.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        coverImage: data.coverImage,
        order: data.order,
        isPublished: data.isPublished,
      },
    });

    return NextResponse.json(album);
  } catch (error) {
    console.error("Error updating album:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'album" },
      { status: 500 }
    );
  }
}

// DELETE - Delete album
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    if (!db.galleryAlbum) {
      return NextResponse.json({ success: true });
    }

    // Photos will be cascade deleted
    await db.galleryAlbum.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting album:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'album" },
      { status: 500 }
    );
  }
}
