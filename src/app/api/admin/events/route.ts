import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { EventType } from '@prisma/client';

// GET - List all events for admin
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as EventType | null;
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (type && Object.values(EventType).includes(type)) {
      where.type = type;
    }
    
    if (published !== null) {
      where.isPublished = published === 'true';
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [events, total] = await Promise.all([
      db.event.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          type: true,
          venue: true,
          city: true,
          startDate: true,
          endDate: true,
          maxAttendees: true,
          isPublished: true,
          image: true,
          createdAt: true,
          association: {
            select: {
              name: true,
              slug: true
            }
          }
        },
        orderBy: { startDate: 'desc' },
        skip,
        take: limit
      }),
      db.event.count({ where })
    ]);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      type,
      venue,
      address,
      city,
      startDate,
      endDate,
      maxAttendees,
      image,
      videoUrl,
      associationId
    } = body;

    // Check if slug already exists
    const existingEvent = await db.event.findUnique({
      where: { slug }
    });

    if (existingEvent) {
      return NextResponse.json(
        { error: 'Un événement avec ce slug existe déjà' },
        { status: 400 }
      );
    }

    const event = await db.event.create({
      data: {
        title,
        slug,
        description,
        type: type as EventType,
        venue,
        address,
        city,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        image,
        videoUrl,
        isPublished: false,
        associationId
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
