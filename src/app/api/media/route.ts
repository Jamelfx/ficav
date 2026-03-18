import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};

    // Filter by type (photo/video)
    if (type && type !== 'all') {
      where.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'all') {
      where.category = category.toLowerCase();
    }

    const media = await db.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        association: {
          select: { name: true },
        },
      },
    });

    if (media.length === 0) {
      return NextResponse.json(getSampleMedia());
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(getSampleMedia());
  }
}

function getSampleMedia() {
  return [
    // Photos - Conferences
    {
      id: '1',
      title: 'Conférence de Presse FICAV 2024',
      description: 'Allocution du Président lors de la conférence de presse annuelle.',
      type: 'photo',
      url: '/images/gallery/conference-1.jpg',
      thumbnailUrl: '/images/gallery/thumbs/conference-1-thumb.jpg',
      category: 'conference',
      association: { name: 'FICAV' },
    },
    {
      id: '2',
      title: 'Panel Discussion: L\'Avenir du Cinéma Africain',
      description: 'Échange entre professionnels sur les perspectives du cinéma continental.',
      type: 'photo',
      url: '/images/gallery/conference-2.jpg',
      thumbnailUrl: '/images/gallery/thumbs/conference-2-thumb.jpg',
      category: 'conference',
      association: { name: 'FICAV' },
    },
    // Photos - Events
    {
      id: '3',
      title: 'Soirée de Remise des Prix',
      description: 'Cérémonie de remise des prix du Festival du Cinéma d\'Abidjan.',
      type: 'photo',
      url: '/images/gallery/event-1.jpg',
      thumbnailUrl: '/images/gallery/thumbs/event-1-thumb.jpg',
      category: 'evenement',
      association: { name: 'FICAV' },
    },
    {
      id: '4',
      title: 'Tournage "Run"',
      description: 'Photos exclusives du tournage du film primé "Run".',
      type: 'photo',
      url: '/images/gallery/event-2.jpg',
      thumbnailUrl: '/images/gallery/thumbs/event-2-thumb.jpg',
      category: 'evenement',
      association: { name: 'APROCIB' },
    },
    {
      id: '5',
      title: 'Masterclass Réalisation',
      description: 'Session de formation avec le réalisateur Philippe Lacôte.',
      type: 'photo',
      url: '/images/gallery/event-3.jpg',
      thumbnailUrl: '/images/gallery/thumbs/event-3-thumb.jpg',
      category: 'evenement',
      association: { name: 'FICAV' },
    },
    // Videos - Interviews
    {
      id: '6',
      title: 'Interview: Régina Saffari',
      description: 'Entretien exclusif avec la réalisatrice primée Régina Saffari.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=example1',
      thumbnailUrl: '/images/gallery/thumbs/interview-1-thumb.jpg',
      category: 'interview',
      association: { name: 'FICAV' },
    },
    {
      id: '7',
      title: 'Portrait: Les Nouveaux Réalisateurs Ivoiriens',
      description: 'Série d\'interviews avec la nouvelle génération de cinéastes.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=example2',
      thumbnailUrl: '/images/gallery/thumbs/interview-2-thumb.jpg',
      category: 'interview',
      association: { name: 'FICAV' },
    },
    // Videos - Documentaries
    {
      id: '8',
      title: 'Documentaire: 35 Ans de Cinéma Ivoirien',
      description: 'Rétrospective de l\'histoire du cinéma ivoirien depuis 1989.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=example3',
      thumbnailUrl: '/images/gallery/thumbs/doc-1-thumb.jpg',
      category: 'conference',
      association: { name: 'FICAV' },
    },
    // More Photos
    {
      id: '9',
      title: 'Assemblée Générale 2024',
      description: 'Photos de l\'assemblée générale annuelle de la FICAV.',
      type: 'photo',
      url: '/images/gallery/ag-2024.jpg',
      thumbnailUrl: '/images/gallery/thumbs/ag-2024-thumb.jpg',
      category: 'conference',
      association: { name: 'FICAV' },
    },
    {
      id: '10',
      title: 'Projection en Plein Air',
      description: 'Cinéma itinérant dans les quartiers d\'Abidjan.',
      type: 'photo',
      url: '/images/gallery/projection-plein-air.jpg',
      thumbnailUrl: '/images/gallery/thumbs/projection-plein-air-thumb.jpg',
      category: 'evenement',
      association: { name: 'APROCIB' },
    },
    {
      id: '11',
      title: 'Formation Technique Audiovisuelle',
      description: 'Session pratique de formation aux techniques de tournage.',
      type: 'photo',
      url: '/images/gallery/formation-1.jpg',
      thumbnailUrl: '/images/gallery/thumbs/formation-1-thumb.jpg',
      category: 'evenement',
      association: { name: 'FICAV' },
    },
    {
      id: '12',
      title: 'Rencontre Professionnelle',
      description: 'Networking entre professionnels du cinéma et de l\'audiovisuel.',
      type: 'photo',
      url: '/images/gallery/networking.jpg',
      thumbnailUrl: '/images/gallery/thumbs/networking-thumb.jpg',
      category: 'evenement',
      association: { name: 'FICAV' },
    },
  ];
}
