import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AssociationStatus } from '@prisma/client';

// GET - List all associations for admin
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as AssociationStatus | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (status && Object.values(AssociationStatus).includes(status)) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [associations, total] = await Promise.all([
      db.association.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          logo: true,
          description: true,
          category: true,
          city: true,
          status: true,
          email: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              members: true,
              films: true,
              events: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.association.count({ where })
    ]);

    return NextResponse.json({
      associations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin associations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch associations' },
      { status: 500 }
    );
  }
}

// POST - Create new association
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      category,
      city,
      email,
      phone,
      address,
      president,
      vicePresident,
      secretary,
      treasurer,
      website
    } = body;

    // Check if slug already exists
    const existingAssociation = await db.association.findUnique({
      where: { slug }
    });

    if (existingAssociation) {
      return NextResponse.json(
        { error: 'Une association avec ce slug existe déjà' },
        { status: 400 }
      );
    }

    const association = await db.association.create({
      data: {
        name,
        slug,
        description,
        category,
        city,
        email,
        phone,
        address,
        president,
        vicePresident,
        secretary,
        treasurer,
        website,
        status: AssociationStatus.PENDING
      }
    });

    return NextResponse.json(association, { status: 201 });
  } catch (error) {
    console.error('Error creating association:', error);
    return NextResponse.json(
      { error: 'Failed to create association' },
      { status: 500 }
    );
  }
}
