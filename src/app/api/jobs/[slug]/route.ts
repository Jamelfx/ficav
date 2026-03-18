import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const job = await db.job.findUnique({
      where: { slug },
      include: {
        association: {
          select: { 
            id: true,
            name: true, 
            logo: true,
            slug: true,
          },
        },
      },
    });

    if (job) {
      return NextResponse.json(job);
    }

    // Return sample job if not found in database
    const sampleJob = getSampleJobs().find(j => j.slug === slug);
    
    if (sampleJob) {
      return NextResponse.json(sampleJob);
    }

    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

function getSampleJobs() {
  const now = new Date();
  
  return [
    {
      id: '1',
      slug: 'assistant-realisation-abidjan',
      title: 'Assistant à la Réalisation',
      description: 'Nous recherchons un assistant à la réalisation expérimenté pour un long métrage tourné à Abidjan. Le candidat idéal aura une expérience préalable sur des tournages professionnels et une excellente maîtrise des techniques de réalisation.\n\nLe film est une comédie dramatique qui explore les défis de la jeunesse entrepreneuriale ivoirienne. Le tournage se déroulera sur 8 semaines à Abidjan et ses environs.\n\nVous travaillerez en étroite collaboration avec le réalisateur pour coordonner les aspects techniques et artistiques du tournage.',
      type: 'EMPLOI',
      location: 'Abidjan, Côte d\'Ivoire',
      isRemote: false,
      salary: '500 000 - 800 000 FCFA/mois',
      deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      requirements: JSON.stringify([
        'Minimum 2 ans d\'expérience sur des tournages professionnels',
        'Maîtrise des techniques de réalisation cinématographique',
        'Excellente capacité d\'organisation et de coordination',
        'Disponibilité totale sur la période de tournage (8 semaines)',
        'Permis de conduire recommandé',
        'Maîtrise du français, le nouchi est un plus',
      ]),
      contactEmail: 'casting@production.ci',
      contactPhone: '+225 07 00 00 00 00',
      isFilled: false,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      association: { 
        id: '1',
        name: 'APROCIB', 
        logo: null,
        slug: 'aprocib',
      },
    },
    {
      id: '2',
      slug: 'casting-acteur-principal',
      title: 'Casting Acteur Principal Masculin',
      description: 'Casting pour le rôle principal masculin d\'un nouveau film dramatique. Nous cherchons un acteur de 25-35 ans pour incarner un jeune entrepreneur abidjanais.\n\nLe personnage principal, KOUASSI, 28 ans, est un jeune diplômé qui tente de monter sa startup tout en faisant face aux réalités socio-économiques d\'Abidjan. Le rôle demande une grande sensibilité émotionnelle et une capacité à jouer tant la comédie que le drame.',
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
        'Capacité à mémoriser de longues répliques',
      ]),
      contactEmail: 'casting@filmprod.ci',
      contactPhone: '+225 05 00 00 00 00',
      isFilled: false,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      association: { 
        id: '2',
        name: 'FICAV', 
        logo: null,
        slug: 'ficav',
      },
    },
    {
      id: '3',
      slug: 'appel-projet-court-metrage',
      title: 'Appel à Projets: Courts Métrages Jeunesse',
      description: 'La FICAV lance un appel à projets pour la réalisation de courts métrages thématiques sur la jeunesse ivoirienne. 5 projets seront sélectionnés et bénéficieront d\'un accompagnement complet.\n\nCet appel à projets s\'inscrit dans notre programme de soutien à la création émergente. Les projets sélectionnés bénéficieront d\'un budget de production, d\'un accompagnement technique par des professionnels, et d\'une diffusion sur notre plateforme et dans les festivals partenaires.',
      type: 'APPEL_PROJET',
      location: 'Abidjan',
      isRemote: true,
      salary: 'Budget de production: 3 000 000 FCFA',
      deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      requirements: JSON.stringify([
        'Réalisateur ivoirien ou résident en Côte d\'Ivoire',
        'Projet de court métrage de fiction (15-30 minutes)',
        'Dossier complet: scénario, note d\'intention, budget prévisionnel',
        'CV du réalisateur et équipe technique principale',
        'Portfolio ou liens vers travaux antérieurs',
      ]),
      contactEmail: 'projets@ficav.ci',
      contactPhone: '+225 27 22 00 00 00',
      isFilled: false,
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      association: { 
        id: '2',
        name: 'FICAV', 
        logo: null,
        slug: 'ficav',
      },
    },
  ];
}
