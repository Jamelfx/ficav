import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const association = await db.association.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        logo: true,
        description: true,
        category: true,
        
        // Leadership
        president: true,
        vicePresident: true,
        secretary: true,
        treasurer: true,
        
        // Contact
        address: true,
        city: true,
        phone: true,
        email: true,
        website: true,
        
        // Location
        latitude: true,
        longitude: true,
        
        // Status
        status: true,
        createdAt: true,
        
        // Members
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            isVerified: true,
            badges: {
              select: {
                type: true
              }
            }
          },
          take: 10
        },
        _count: {
          select: {
            members: true
          }
        },
        
        // Films
        films: {
          select: {
            id: true,
            slug: true,
            title: true,
            poster: true,
            year: true,
            genre: true
          },
          take: 6,
          orderBy: {
            year: 'desc'
          }
        },
        
        // Events
        events: {
          select: {
            id: true,
            slug: true,
            title: true,
            type: true,
            startDate: true,
            venue: true,
            city: true,
            image: true
          },
          take: 6,
          orderBy: {
            startDate: 'desc'
          }
        },
        
        // Cotisations (latest)
        cotisations: {
          select: {
            id: true,
            year: true,
            amount: true,
            status: true,
            dueDate: true,
            paidAt: true
          },
          orderBy: {
            year: 'desc'
          },
          take: 3
        }
      }
    });

    if (!association) {
      return NextResponse.json(
        { error: 'Association not found' },
        { status: 404 }
      );
    }

    // Get latest cotisation status
    const latestCotisation = association.cotisations[0];
    const cotisationStatus = latestCotisation?.status || 'PENDING';

    return NextResponse.json({
      ...association,
      cotisationStatus,
      memberCount: association._count.members
    });
  } catch (error) {
    console.error('Error fetching association:', error);
    return NextResponse.json(
      { error: 'Failed to fetch association' },
      { status: 500 }
    );
  }
}
