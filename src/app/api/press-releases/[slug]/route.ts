import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/press-releases/[slug] - Get single press release
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const pressRelease = await db.pressRelease.findUnique({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!pressRelease) {
      return NextResponse.json(
        { error: 'Press release not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ pressRelease });
  } catch (error) {
    console.error('Press release error:', error);
    // Return fallback data
    const fallback = getFallbackPressReleases().find(
     async (pr) => pr.slug === (params ? (await params).slug : '')
    );

    if (!fallback) {
      return NextResponse.json(
        { error: 'Press release not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ pressRelease: fallback });
  }
}

// Fallback press releases data
function getFallbackPressReleases() {
  return [
    {
      id: '1',
      slug: 'festival-cinema-2024',
      title: 'FICAV annonce la 10ème édition du Festival du Cinéma Ivoirien',
      content: `La Fédération Ivoirienne du Cinéma et de l'Audiovisuel (FICAV) a le plaisir d'annoncer la tenue de la 10ème édition du Festival du Cinéma Ivoirien, qui se déroulera du 15 au 22 novembre 2024 à Abidjan.

Cette édition anniversaire mettra à l'honneur le thème "Le cinéma ivoirien à l'ère numérique" et accueillera des délégations de plus de 20 pays africains et internationaux.

Au programme :
- Compétition officielle de longs métrages
- Compétition de courts métrages
- Masterclasses et ateliers professionnels
- Marché du film
- Soirées de networking

Les inscriptions sont ouvertes jusqu'au 30 septembre 2024.`,
      type: 'communiqué',
      attachmentUrl: null,
      publishedAt: new Date('2024-06-15'),
    },
    {
      id: '2',
      slug: 'formation-realisation-2024',
      title: 'Lancement du programme de formation à la réalisation',
      content: `Dans le cadre de son programme de renforcement des capacités, la FICAV lance un nouveau cycle de formation à la réalisation cinématographique.

Cette formation intensive de 6 mois s'adresse aux jeunes réalisateurs ivoiriens souhaitant développer leurs compétences techniques et artistiques.

Objectifs pédagogiques :
- Maîtrise des techniques de réalisation
- Écriture scénaristique
- Direction d'acteurs
- Gestion de production

La formation est gratuite pour les membres de la FICAV. Les candidatures doivent être soumises avant le 31 juillet 2024.`,
      type: 'dossier',
      attachmentUrl: '/documents/formation-realisation-2024.pdf',
      publishedAt: new Date('2024-05-20'),
    },
    {
      id: '3',
      slug: 'conference-presse-festival',
      title: 'Conférence de presse : Programme du Festival 2024',
      content: `La FICAV organise une conférence de presse le 1er octobre 2024 à 10h au Palais de la Culture de Treichville pour présenter le programme officiel de la 10ème édition du Festival du Cinéma Ivoirien.

Points à l'ordre du jour :
- Présentation de la sélection officielle
- Annonce des membres du jury
- Programme des manifestations
- Partenariats et sponsors

La conférence sera suivie d'un cocktail de lancement. Accès sur accréditation uniquement.`,
      type: 'conférence',
      attachmentUrl: null,
      publishedAt: new Date('2024-04-10'),
    },
    {
      id: '4',
      slug: 'partenariat-netflix',
      title: 'Partenariat stratégique avec Netflix pour la promotion du cinéma ivoirien',
      content: `La FICAV est fière d'annoncer la signature d'un partenariat stratégique avec Netflix pour la promotion et la distribution du cinéma ivoirien sur la plateforme.

Ce partenariat prévoit :
- L'acquisition de 10 films ivoiriens par an
- Un programme de formation aux métiers du streaming
- Le financement de 3 productions originales

Cette collaboration marque une étape importante dans l'internationalisation du cinéma ivoirien et offre de nouvelles opportunités pour nos réalisateurs et producteurs.`,
      type: 'communiqué',
      attachmentUrl: '/documents/partenariat-netflix.pdf',
      publishedAt: new Date('2024-03-05'),
    },
    {
      id: '5',
      slug: 'resultats-appel-projets',
      title: 'Résultats de l\'appel à projets 2024 : 12 lauréats sélectionnés',
      content: `La FICAV annonce les résultats de son appel à projets 2024. Sur 150 candidatures reçues, 12 projets ont été sélectionnés pour bénéficier d'un accompagnement financier et technique.

Les projets lauréats couvrent différents genres :
- 4 longs métrages de fiction
- 3 documentaires
- 3 courts métrages
- 2 séries web

Chaque lauréat recevra une enveloppe de production et un accompagnement par des mentors expérimentés de l'industrie.

La cérémonie de remise des prix aura lieu le 15 juin 2024.`,
      type: 'communiqué',
      attachmentUrl: '/documents/laureats-2024.pdf',
      publishedAt: new Date('2024-02-28'),
    },
    {
      id: '6',
      slug: 'dossier-presse-ficav-2024',
      title: 'Dossier de presse FICAV 2024',
      content: `Découvrez le dossier de presse complet de la Fédération Ivoirienne du Cinéma et de l'Audiovisuel pour l'année 2024.

Ce dossier comprend :
- Présentation de la FICAV et de ses missions
- Chiffres clés du cinéma ivoirien
- Les associations membres
- Le calendrier des événements 2024
- Les contacts presse

Le dossier est disponible en français et en anglais.`,
      type: 'dossier',
      attachmentUrl: '/documents/dossier-presse-ficav-2024.pdf',
      publishedAt: new Date('2024-01-15'),
    },
  ];
}
