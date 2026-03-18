import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AssociationStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Filters
    const category = searchParams.get('category');
    const status = searchParams.get('status') as AssociationStatus | null;
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (category) {
      where.category = category;
    }
    
    if (status && Object.values(AssociationStatus).includes(status)) {
      where.status = status;
    }
    
    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive'
      };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get associations with member count
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
          latitude: true,
          longitude: true,
          _count: {
            select: {
              members: true,
              films: true,
              events: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        },
        skip,
        take: limit
      }),
      db.association.count({ where })
    ]);

    // Get unique cities for filter
    const cities = await db.association.findMany({
      where: { city: { not: null } },
      select: { city: true },
      distinct: ['city']
    });

    // Get unique categories for filter
    const categories = await db.association.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category']
    });

    return NextResponse.json({
      associations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        cities: cities.map(c => c.city).filter(Boolean),
        categories: categories.map(c => c.category).filter(Boolean)
      }
    });
  } catch (error) {
    console.error('Error fetching associations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch associations' },
      { status: 500 }
    );
  }
}
