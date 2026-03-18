import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { JobType } from '@prisma/client';

// GET - List all jobs for admin
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as JobType | null;
    const filled = searchParams.get('filled');
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (type && Object.values(JobType).includes(type)) {
      where.type = type;
    }
    
    if (filled !== null) {
      where.isFilled = filled === 'true';
    }
    
    if (published !== null) {
      where.isPublished = published === 'true';
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          type: true,
          location: true,
          isRemote: true,
          salary: true,
          deadline: true,
          isFilled: true,
          isPublished: true,
          contactEmail: true,
          contactPhone: true,
          createdAt: true,
          association: {
            select: {
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.job.count({ where })
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      type,
      location,
      isRemote,
      salary,
      deadline,
      requirements,
      contactEmail,
      contactPhone,
      associationId
    } = body;

    // Check if slug already exists
    const existingJob = await db.job.findUnique({
      where: { slug }
    });

    if (existingJob) {
      return NextResponse.json(
        { error: 'Une offre avec ce slug existe déjà' },
        { status: 400 }
      );
    }

    const job = await db.job.create({
      data: {
        title,
        slug,
        description,
        type: type as JobType,
        location,
        isRemote: isRemote || false,
        salary,
        deadline: deadline ? new Date(deadline) : null,
        requirements,
        contactEmail,
        contactPhone,
        isFilled: false,
        isPublished: false,
        associationId
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
