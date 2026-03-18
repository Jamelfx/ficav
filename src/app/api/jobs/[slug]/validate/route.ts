import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PATCH - Validate or reject a job offer (Director of Communication only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action, rejectionReason, validatedBy } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action invalide. Utilisez "approve" ou "reject"' },
        { status: 400 }
      );
    }

    // Get the job
    const job = await db.job.findUnique({
      where: { slug },
      include: {
        association: {
          select: { name: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Offre non trouvée' },
        { status: 404 }
      );
    }

    if (job.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cette offre a déjà été traitée' },
        { status: 400 }
      );
    }

    // Update job status
    const updatedJob = await db.job.update({
      where: { slug },
      data: {
        status: action === 'approve' ? 'PUBLISHED' : 'REJECTED',
        isPublished: action === 'approve',
        validatedBy: validatedBy || null,
        validatedAt: new Date(),
        rejectionReason: action === 'reject' ? rejectionReason : null,
      },
    });

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: action === 'approve' 
        ? 'Offre approuvée et publiée avec succès' 
        : 'Offre refusée',
    });
  } catch (error) {
    console.error('Error validating job:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation de l\'offre' },
      { status: 500 }
    );
  }
}
