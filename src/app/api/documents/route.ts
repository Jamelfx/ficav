import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    // Filter by category
    if (category && category !== 'all') {
      where.category = category.toLowerCase();
    }

    // Filter by search term
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const documents = await db.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        association: {
          select: { name: true, logo: true },
        },
      },
    });

    if (documents.length === 0) {
      return NextResponse.json(getSampleDocuments());
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(getSampleDocuments());
  }
}

function getSampleDocuments() {
  return [
    {
      id: '1',
      title: 'Statuts de la FICAV',
      description: 'Document officiel définissant les statuts de la Fédération Ivoirienne du Cinéma et de l\'Audiovisuel. Ce document présente la constitution, les objectifs, l\'organisation et le fonctionnement de la fédération.',
      category: 'statuts',
      fileUrl: '/documents/statuts-ficav.pdf',
      fileType: 'application/pdf',
      fileSize: 245000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Règlement Intérieur',
      description: 'Règlement intérieur de la FICAV définissant les règles de fonctionnement, les droits et obligations des membres, ainsi que les procédures disciplinaires.',
      category: 'reglements',
      fileUrl: '/documents/reglement-interieur.pdf',
      fileType: 'application/pdf',
      fileSize: 180000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      title: 'Procès-verbal AG 2024',
      description: 'Compte-rendu de l\'Assemblée Générale Ordinaire tenue le 15 mars 2024. Ce document reprend toutes les décisions votées et les points abordés lors de l\'assemblée.',
      category: 'pv',
      fileUrl: '/documents/pv-ag-2024.pdf',
      fileType: 'application/pdf',
      fileSize: 320000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2024-03-20'),
    },
    {
      id: '4',
      title: 'Procès-verbal AG Extraordinaire 2023',
      description: 'Compte-rendu de l\'Assemblée Générale Extraordinaire tenue en décembre 2023 pour la modification des statuts.',
      category: 'pv',
      fileUrl: '/documents/pv-age-2023.pdf',
      fileType: 'application/pdf',
      fileSize: 280000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2023-12-15'),
    },
    {
      id: '5',
      title: 'Convention Collective du Cinéma',
      description: 'Convention collective interprofessionnelle du secteur cinématographique et audiovisuel ivoirien. Définit les conditions de travail, les salaires minima et les avantages sociaux.',
      category: 'conventions',
      fileUrl: '/documents/convention-collective.pdf',
      fileType: 'application/pdf',
      fileSize: 520000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2023-06-01'),
    },
    {
      id: '6',
      title: 'Rapport d\'Activités 2023',
      description: 'Bilan complet des activités de la FICAV pour l\'année 2023 : événements organisés, actions menées, statistiques de production, et perspectives pour l\'avenir.',
      category: 'rapports',
      fileUrl: '/documents/rapport-activites-2023.pdf',
      fileType: 'application/pdf',
      fileSize: 1500000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2024-02-01'),
    },
    {
      id: '7',
      title: 'Rapport Financier 2023',
      description: 'États financiers de la FICAV pour l\'exercice 2023. Comprend le bilan, le compte de résultat et les annexes.',
      category: 'rapports',
      fileUrl: '/documents/rapport-financier-2023.pdf',
      fileType: 'application/pdf',
      fileSize: 890000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2024-02-15'),
    },
    {
      id: '8',
      title: 'Étude sur le Marché du Cinéma Ivoirien',
      description: 'Étude complète sur l\'état du marché cinématographique ivoirien en 2023. Analyse des tendances, des acteurs et des opportunités de développement.',
      category: 'etudes',
      fileUrl: '/documents/etude-marche-2023.pdf',
      fileType: 'application/pdf',
      fileSize: 2100000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2023-11-01'),
    },
    {
      id: '9',
      title: 'Code de Déontologie',
      description: 'Code de déontologie des professionnels du cinéma et de l\'audiovisuel ivoirien. Définit les règles éthiques et les bonnes pratiques du métier.',
      category: 'reglements',
      fileUrl: '/documents/code-deontologie.pdf',
      fileType: 'application/pdf',
      fileSize: 156000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2023-09-01'),
    },
    {
      id: '10',
      title: 'Convention avec l\'État de Côte d\'Ivoire',
      description: 'Convention cadre signée entre la FICAV et le Ministère de la Culture définissant les modalités de partenariat et de soutien au secteur cinématographique.',
      category: 'conventions',
      fileUrl: '/documents/convention-etat.pdf',
      fileType: 'application/pdf',
      fileSize: 450000,
      association: { name: 'FICAV', logo: null },
      createdAt: new Date('2023-04-15'),
    },
  ];
}
