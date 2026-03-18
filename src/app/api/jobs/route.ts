import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch jobs (published for public, pending for Director of Communication)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const status = searchParams.get('status'); // 'active' or 'expired'
    const forValidation = searchParams.get('forValidation'); // 'true' for Director of Communication

    const where: Record<string, unknown> = {};

    // If forValidation is true, show pending jobs (for Director of Communication)
    if (forValidation === 'true') {
      where.status = 'PENDING';
    } else {
      // For public, show only published and approved jobs
      where.status = 'PUBLISHED';
      where.isPublished = true;
    }

    // Filter by type
    if (type && type !== 'all') {
      where.type = type.toUpperCase();
    }

    // Filter by location
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    // Filter by search term (title)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by deadline status (only for public/published jobs)
    if (forValidation !== 'true') {
      const now = new Date();
      if (status === 'active') {
        where.OR = [
          { deadline: null },
          { deadline: { gte: now } },
        ];
        where.isFilled = false;
      } else if (status === 'expired') {
        where.deadline = { lt: now };
      }
    }

    const jobs = await db.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        association: {
          select: { name: true, logo: true, slug: true },
        },
      },
    });

    if (jobs.length === 0 && forValidation !== 'true') {
      return NextResponse.json(getSampleJobs());
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(getSampleJobs());
  }
}

// POST - Create a new job offer (from association admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
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

    // Validate required fields
    if (!title || !type || !associationId) {
      return NextResponse.json(
        { error: 'Titre, type et association sont requis' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    // Create job with PENDING status
    const job = await db.job.create({
      data: {
        slug,
        title,
        description: description || null,
        type: type as 'EMPLOI' | 'CASTING' | 'APPEL_PROJET' | 'STAGE' | 'FORMATION',
        location: location || null,
        isRemote: isRemote || false,
        salary: salary || null,
        deadline: deadline ? new Date(deadline) : null,
        requirements: requirements ? JSON.stringify(requirements) : null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        status: 'PENDING',
        isPublished: false,
        associationId,
      },
      include: {
        association: {
          select: { name: true, logo: true },
        },
      },
    });

    // Create notification for Director of Communication
    await db.notification.create({
      data: {
        type: 'JOB_OFFER',
        title: 'Nouvelle offre à valider',
        message: `L'association "${job.association?.name || 'Inconnu'}" a soumis une nouvelle offre: "${title}"`,
        referenceId: job.id,
        referenceType: 'Job',
        recipientRole: 'DIRECTEUR_COMMUNICATION',
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'offre' },
      { status: 500 }
    );
  }
}

function getSampleJobs() {
  const now = new Date();
  
  return [
    {
      id: '1',
      slug: 'assistant-realisation-abidjan',
      title: 'Assistant à la Réalisation',
      description: 'Nous recherchons un assistant à la réalisation expérimenté pour un long métrage tourné à Abidjan. Le candidat idéal aura une expérience préalable sur des tournages professionnels et une excellente maîtrise des techniques de réalisation.',
      type: 'EMPLOI',
      location: 'Abidjan, Côte d\'Ivoire',
      isRemote: false,
      salary: '500 000 - 800 000 FCFA/mois',
      deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      requirements: JSON.stringify([
        'Minimum 2 ans d\'expérience sur des tournages',
        'Maîtrise des techniques de réalisation',
        'Excellente capacité d\'organisation',
        'Disponibilité totale sur la période de tournage',
        'Permis de conduire recommandé',
      ]),
      contactEmail: 'casting@production.ci',
      contactPhone: '+225 07 00 00 00 00',
      isFilled: false,
      status: 'PUBLISHED',
      association: { name: 'APROCIB', logo: null },
    },
    {
      id: '2',
      slug: 'casting-acteur-principal',
      title: 'Casting Acteur Principal Masculin',
      description: 'Casting pour le rôle principal masculin d\'un nouveau film dramatique. Nous cherchons un acteur de 25-35 ans pour incarner un jeune entrepreneur abidjanais.',
      type: 'CASTING',
      location: 'Abidjan, Cocody',
      isRemote: false,
      salary: 'Rémunération selon profil',
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      requirements: JSON.stringify([
        'Homme, 25-35 ans',
        'Expérience en théâtre ou cinéma',
        'Disponible pour 6 semaines de tournage',
        'Maîtrise du français et du nouchi',
      ]),
      contactEmail: 'casting@filmprod.ci',
      contactPhone: '+225 05 00 00 00 00',
      isFilled: false,
      status: 'PUBLISHED',
      association: { name: 'FICAV', logo: null },
    },
    {
      id: '3',
      slug: 'appel-projet-court-metrage',
      title: 'Appel à Projets: Courts Métrages Jeunesse',
      description: 'La FICAV lance un appel à projets pour la réalisation de courts métrages thématiques sur la jeunesse ivoirienne. 5 projets seront sélectionnés et bénéficieront d\'un accompagnement complet.',
      type: 'APPEL_PROJET',
      location: 'Abidjan',
      isRemote: true,
      salary: 'Budget de production: 3 000 000 FCFA',
      deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      requirements: JSON.stringify([
        'Réalisateur ivoirien ou résident',
        'Projet de court métrage (15-30 min)',
        'Dossier complet avec scénario et note d\'intention',
        'CV du réalisateur',
      ]),
      contactEmail: 'projets@ficav.ci',
      contactPhone: '+225 27 22 00 00 00',
      isFilled: false,
      status: 'PUBLISHED',
      association: { name: 'FICAV', logo: null },
    },
    {
      id: '4',
      slug: 'stage-monteur-video',
      title: 'Stage Monteur Vidéo',
      description: 'Stage de 3 mois en post-production au sein d\'une société de production audiovisuelle. Formation complète sur Premiere Pro et DaVinci Resolve.',
      type: 'STAGE',
      location: 'Plateau, Abidjan',
      isRemote: false,
      salary: 'Indemnité de stage: 150 000 FCFA/mois',
      deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      requirements: JSON.stringify([
        'Étudiant en audiovisuel ou communication',
        'Connaissances de base en montage vidéo',
        'Maîtrise des outils Adobe',
        'Curiosité et créativité',
      ]),
      contactEmail: 'rh@mediaprod.ci',
      contactPhone: null,
      isFilled: false,
      status: 'PUBLISHED',
      association: { name: 'APROCIB', logo: null },
    },
    {
      id: '5',
      slug: 'formation-scenario',
      title: 'Formation: Écriture Scénaristique',
      description: 'Formation intensive de 2 semaines sur l\'écriture de scénario. Animée par des professionnels du cinéma, cette formation couvre les fondamentaux de la narration cinématographique.',
      type: 'FORMATION',
      location: 'Institut Français, Abidjan',
      isRemote: false,
      salary: 'Coût: 100 000 FCFA (boursable)',
      deadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      requirements: JSON.stringify([
        'Avoir un projet de scénario en cours',
        'Lettre de motivation',
        'CV',
      ]),
      contactEmail: 'formation@ficav.ci',
      contactPhone: '+225 27 22 00 00 00',
      isFilled: false,
      status: 'PUBLISHED',
      association: { name: 'FICAV', logo: null },
    },
  ];
}
