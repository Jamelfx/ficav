import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const news = await db.news.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { publishedAt: 'desc' },
    });

    if (news.length === 0) {
      return NextResponse.json(getSampleNews());
    }

    return NextResponse.json(news);
  } catch {
    return NextResponse.json(getSampleNews());
  }
}

function getSampleNews() {
  return [
    {
      id: '1',
      slug: 'festival-cinema-abidjan-2024',
      title: 'Festival du Cinéma d\'Abidjan 2024 : Les nominations révélées',
      excerpt: 'La 15ème édition du Festival du Cinéma d\'Abidjan dévoile sa sélection officielle avec 24 films en compétition.',
      content: 'La 15ème édition du Festival du Cinéma d\'Abidjan promet d\'être exceptionnelle avec 24 films en compétition...',
      image: '/images/news/festival.jpg',
      isFeatured: true,
      publishedAt: new Date('2024-12-01'),
    },
    {
      id: '2',
      slug: 'formation-realisation-2024',
      title: 'Formation en réalisation : Inscriptions ouvertes',
      excerpt: 'FICAV lance son programme de formation intensive pour les jeunes réalisateurs ivoiriens.',
      content: 'Le programme de formation de la FICAV ouvre ses portes...',
      image: '/images/news/formation.jpg',
      isFeatured: false,
      publishedAt: new Date('2024-11-28'),
    },
    {
      id: '3',
      slug: 'rencontre-professionnels-lagos',
      title: 'Rencontre des professionnels à Lagos',
      excerpt: 'Une délégation de la FICAV participe au forum régional du cinéma africain.',
      content: 'Une délégation de professionnels ivoiriens se rend à Lagos...',
      image: '/images/news/lagos.jpg',
      isFeatured: false,
      publishedAt: new Date('2024-11-25'),
    },
    {
      id: '4',
      slug: 'nouveaux-membres-associations',
      title: '3 nouvelles associations rejoignent la FICAV',
      excerpt: 'L\'Union des Techniciens, l\'Association des Réalisateurs et le Collectif des Scénaristes intègrent la fédération.',
      content: 'La FICAV accueille trois nouvelles associations membres...',
      image: '/images/news/membres.jpg',
      isFeatured: false,
      publishedAt: new Date('2024-11-20'),
    },
    {
      id: '5',
      slug: 'cinema-numerique-afrique',
      title: 'Le cinéma numérique en Afrique : Enjeux et perspectives',
      excerpt: 'Conférence-débat sur la transformation digitale de l\'industrie cinématographique africaine.',
      content: 'Une table ronde s\'est tenue à Abidjan sur le thème du cinéma numérique...',
      image: '/images/news/digital.jpg',
      isFeatured: false,
      publishedAt: new Date('2024-11-15'),
    },
  ];
}
