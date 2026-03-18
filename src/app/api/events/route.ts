import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { EventType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || '';
    const past = searchParams.get('past') === 'true';
    const year = searchParams.get('year') || '';
    const month = searchParams.get('month') || '';

    // Build filter conditions
    const where: any = { isPublished: true };

    if (type) {
      where.type = type as EventType;
    }

    if (!past) {
      where.startDate = { gte: new Date() };
    }

    const events = await db.event.findMany({
      where,
      orderBy: { startDate: past ? 'desc' : 'asc' },
      include: {
        association: {
          select: { name: true, slug: true },
        },
      },
    });

    if (events.length === 0) {
      return NextResponse.json(getSampleEvents(type, past, year, month));
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(getSampleEvents());
  }
}

function getSampleEvents(type = '', past = false, year = '', month = '') {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const allEvents = [
    // Upcoming events
    {
      id: '1',
      slug: 'festival-cinema-abidjan-2025',
      title: 'Festival du Cinéma d\'Abidjan 2025',
      description: 'La 16ème édition du plus grand festival de cinéma de Côte d\'Ivoire. Une semaine de projections, de masterclasses et de rencontres avec les plus grands noms du cinéma africain. Au programme : compétition officielle, sections parallèles, hommages et soirées spéciales.',
      type: 'FESTIVAL',
      venue: 'Palais de la Culture',
      address: 'Rue des Jardins, Treichville',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/festival.jpg',
      maxAttendees: 2000,
      association: { name: 'FICAV', slug: 'ficav' },
    },
    {
      id: '2',
      slug: 'assemblee-generale-ficav',
      title: 'Assemblée Générale Annuelle FICAV',
      description: 'Bilan annuel et perspectives pour l\'année à venir. Tous les membres sont invités à participer à cette assemblée importante où seront présentés les résultats de l\'année écoulée et les projets pour l\'avenir.',
      type: 'ASSEMBLY',
      venue: 'Siège FICAV',
      address: 'Plateau, Immeuble le Centre, 5ème étage',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/ag.jpg',
      maxAttendees: 150,
      association: { name: 'FICAV', slug: 'ficav' },
    },
    {
      id: '3',
      slug: 'masterclass-realisation-regina',
      title: 'Masterclass Réalisation avec Régina Saffari',
      description: 'Apprenez les techniques de réalisation avec une professionnelle du cinéma. Régina Saffari, réalisatrice primée, partagera son expérience et ses conseils pour réussir dans l\'industrie du cinéma. Places limitées.',
      type: 'TRAINING',
      venue: 'Institut Français',
      address: 'Rue des Jardins, Cocody',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/masterclass.jpg',
      maxAttendees: 50,
      association: { name: 'ARPA', slug: 'arpa' },
    },
    {
      id: '4',
      slug: 'projection-run-avant-premiere',
      title: 'Avant-première "Run"',
      description: 'Projection exclusive du dernier film ivoirien primé internationalement. Suivie d\'une discussion avec l\'équipe du film. Un événement à ne pas manquer pour les amateurs de cinéma de qualité.',
      type: 'PROJECTION',
      venue: 'Cinéma Majestic',
      address: 'Boulevard de Marseille, Marcory',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/projection.jpg',
      maxAttendees: 300,
      association: { name: 'ARPA', slug: 'arpa' },
    },
    {
      id: '5',
      slug: 'conference-etat-cinema-ivoirien',
      title: 'Conférence : L\'état du cinéma ivoirien',
      description: 'Une table ronde avec des experts de l\'industrie pour discuter des défis et opportunités du cinéma ivoirien actuel. Intervenants : réalisateurs, producteurs, distributeurs et représentants institutionnels.',
      type: 'CONFERENCE',
      venue: 'Université Félix Houphouët-Boigny',
      address: 'Campus de Cocody',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/conference.jpg',
      maxAttendees: 200,
      association: { name: 'ARPACI', slug: 'arpaci' },
    },
    {
      id: '6',
      slug: 'atelier-scenario-debutants',
      title: 'Atelier d\'Écriture Scénaristique pour Débutants',
      description: 'Un atelier pratique de 3 jours pour apprendre les bases de l\'écriture scénaristique. Animation par des scénaristes professionnels. Participants max : 25.',
      type: 'WORKSHOP',
      venue: 'Maison de la Culture',
      address: 'Plateau, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/workshop.jpg',
      maxAttendees: 25,
      association: { name: 'SACI', slug: 'saci' },
    },
    {
      id: '7',
      slug: 'festival-court-metrage-yamoussoukro',
      title: 'Festival du Court Métrage de Yamoussoukro',
      description: 'Le festival dédié aux courts métrages africains. Compétition officielle, projections en plein air, et ateliers de formation. Un rendez-vous incontournable pour les créateurs de contenu.',
      type: 'FESTIVAL',
      venue: 'Centre Culturel Municipal',
      address: 'Quartier Administratif',
      city: 'Yamoussoukro',
      startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/festival-court.jpg',
      maxAttendees: 800,
      association: { name: 'FICAV', slug: 'ficav' },
    },
    {
      id: '8',
      slug: 'formation-technique-son',
      title: 'Formation Technique : Le Son au Cinéma',
      description: 'Une formation intensive sur les techniques de prise de son et de mixage pour le cinéma. Théorie et pratique avec du matériel professionnel.',
      type: 'TRAINING',
      venue: 'Studio National',
      address: 'Treichville, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/formation.jpg',
      maxAttendees: 20,
      association: { name: 'ATIC', slug: 'atic' },
    },
    {
      id: '9',
      slug: 'projection-debat-kalakuta',
      title: 'Projection-Débat : Kalakuta',
      description: 'Projection du documentaire Kalakuta suivie d\'un débat avec le réalisateur Rampa Yé. L\'occasion de discuter de l\'héritage musical de Fela Kuti.',
      type: 'PROJECTION',
      venue: 'Institut Goethe',
      address: 'Cocody, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/projection-debat.jpg',
      maxAttendees: 100,
      association: { name: 'ARPA', slug: 'arpa' },
    },
    {
      id: '10',
      slug: 'atelier-casting-professionnel',
      title: 'Atelier Casting : Comment réussir son audition',
      description: 'Un atelier pratique pour acteurs souhaitant perfectionner leur technique d\'audition. Conseils de directeurs de casting professionnels.',
      type: 'WORKSHOP',
      venue: 'Studio 225',
      address: 'Marcory, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/casting.jpg',
      maxAttendees: 30,
      association: { name: 'GAM', slug: 'gam' },
    },
    // Past events
    {
      id: '11',
      slug: 'festival-cinema-abidjan-2024',
      title: 'Festival du Cinéma d\'Abidjan 2024',
      description: 'La 15ème édition du festival a été un succès retentissant avec plus de 10 000 spectateurs.',
      type: 'FESTIVAL',
      venue: 'Palais de la Culture',
      address: 'Rue des Jardins, Treichville',
      city: 'Abidjan',
      startDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() - 173 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/festival-2024.jpg',
      maxAttendees: 2000,
      association: { name: 'FICAV', slug: 'ficav' },
    },
    {
      id: '12',
      slug: 'assemblee-generale-extraordinaire',
      title: 'Assemblée Générale Extraordinaire',
      description: 'Assemblée extraordinaire pour l\'adoption des nouveaux statuts de la fédération.',
      type: 'ASSEMBLY',
      venue: 'Hôtel Ivoire',
      address: 'Plateau, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/ag-extra.jpg',
      maxAttendees: 200,
      association: { name: 'FICAV', slug: 'ficav' },
    },
    {
      id: '13',
      slug: 'masterclass-montage',
      title: 'Masterclass Montage avec Marie-Hélène Dozo',
      description: 'Une journée d\'apprentissage avec la célèbre monteuse belgo-congolaise.',
      type: 'TRAINING',
      venue: 'Institut Français',
      address: 'Cocody, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/masterclass-montage.jpg',
      maxAttendees: 40,
      association: { name: 'ATIC', slug: 'atic' },
    },
    {
      id: '14',
      slug: 'conference-financement-cinema',
      title: 'Conférence : Le financement du cinéma africain',
      description: 'Table ronde sur les nouvelles formes de financement du cinéma en Afrique.',
      type: 'CONFERENCE',
      venue: 'Chambre de Commerce',
      address: 'Plateau, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/conf-finance.jpg',
      maxAttendees: 150,
      association: { name: 'APIC', slug: 'apic' },
    },
    {
      id: '15',
      slug: 'journees-portes-ouvertes',
      title: 'Journées Portes Ouvertes FICAV',
      description: 'Découvrez les activités de la fédération et rencontrez nos membres.',
      type: 'ASSEMBLY',
      venue: 'Siège FICAV',
      address: 'Plateau, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/portes-ouvertes.jpg',
      maxAttendees: 300,
      association: { name: 'FICAV', slug: 'ficav' },
    },
  ];

  // Filter by type
  let filtered = allEvents;

  if (type) {
    filtered = filtered.filter(event => event.type === type);
  }

  // Filter by past/upcoming
  const nowTime = now.getTime();
  if (past) {
    filtered = filtered.filter(event => new Date(event.startDate).getTime() < nowTime);
  } else {
    filtered = filtered.filter(event => new Date(event.startDate).getTime() >= nowTime);
  }

  // Filter by year
  if (year) {
    filtered = filtered.filter(event => 
      new Date(event.startDate).getFullYear().toString() === year
    );
  }

  // Filter by month
  if (month) {
    filtered = filtered.filter(event => 
      (new Date(event.startDate).getMonth() + 1).toString() === month
    );
  }

  return filtered;
}
