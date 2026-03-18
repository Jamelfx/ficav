import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const year = searchParams.get('year') || '';
    const director = searchParams.get('director') || '';
    const actor = searchParams.get('actor') || '';

    // Build filter conditions
    const where: any = { isPublished: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleOriginal: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (genre) {
      where.genre = { contains: genre, mode: 'insensitive' };
    }

    if (year) {
      where.year = parseInt(year);
    }

    const films = await db.film.findMany({
      where,
      orderBy: { year: 'desc' },
      include: {
        association: {
          select: { name: true },
        },
        director: {
          select: { name: true },
        },
        cast: {
          take: 5,
        },
        crew: {
          where: { role: { contains: 'Réalisateur' } },
        },
      },
    });

    // Filter by director name if provided
    let filteredFilms = films;
    if (director) {
      filteredFilms = films.filter(film => 
        film.director?.name?.toLowerCase().includes(director.toLowerCase()) ||
        film.crew.some(c => c.memberName?.toLowerCase().includes(director.toLowerCase()))
      );
    }

    // Filter by actor name if provided
    if (actor) {
      filteredFilms = filteredFilms.filter(film => 
        film.cast.some(c => c.actorName?.toLowerCase().includes(actor.toLowerCase()))
      );
    }

    if (filteredFilms.length === 0) {
      return NextResponse.json(getSampleFilms(search, genre, year));
    }

    return NextResponse.json(filteredFilms);
  } catch (error) {
    console.error('Error fetching films:', error);
    return NextResponse.json(getSampleFilms());
  }
}

function getSampleFilms(search = '', genre = '', year = '') {
  const allFilms = [
    {
      id: '1',
      slug: 'run-film',
      title: 'Run',
      titleOriginal: 'Run',
      poster: '/images/films/run.jpg',
      synopsis: 'Un thriller captivant qui explore les défis de la jeunesse africaine moderne. Dans les rues d\'Abidjan, un jeune homme se retrouve pris dans une course contre la montre pour sauver sa famille. Ce film poignant aborde les thèmes de la survie, de l\'amitié et du sacrifice dans un contexte urbain contemporain.',
      duration: 110,
      year: 2024,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Étalon d\'Or FESPACO 2024', year: 2024 },
        { name: 'Meilleur Film Panafrican Film Festival', year: 2024 },
      ]),
      cast: [
        { id: 'c1', actorName: 'Jean-Baptiste Anoumou', characterName: 'Kouassi' },
        { id: 'c2', actorName: 'Marie-Louise Asseu', characterName: 'Aya' },
        { id: 'c3', actorName: 'Serge Kanyou', characterName: 'Moussa' },
      ],
      crew: [
        { id: 'cr1', role: 'Réalisateur', memberName: 'Philip Lacôte' },
        { id: 'cr2', role: 'Directeur de la Photographie', memberName: 'Julien Rouch' },
        { id: 'cr3', role: 'Monteur', memberName: 'Marie-Hélène Dozo' },
        { id: 'cr4', role: 'Scénariste', memberName: 'Philip Lacôte' },
      ],
    },
    {
      id: '2',
      slug: 'philo-film',
      title: 'Philo',
      titleOriginal: 'Philo',
      poster: '/images/films/philo.jpg',
      synopsis: 'L\'histoire touchante d\'un jeune professeur qui arrive dans un village reculé de Côte d\'Ivoire et transforme la vie de ses élèves. À travers son dévouement, il réussit à réconcilier les traditions ancestrales avec l\'éducation moderne.',
      duration: 95,
      year: 2023,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Prix du Public Festival de Namur', year: 2023 },
      ]),
      cast: [
        { id: 'c4', actorName: 'Didier G. Agba', characterName: 'Philo' },
        { id: 'c5', actorName: 'Blandine Yameogo', characterName: 'Adama' },
      ],
      crew: [
        { id: 'cr5', role: 'Réalisateur', memberName: 'Abderrahmane Sissako' },
        { id: 'cr6', role: 'Directeur de la Photographie', memberName: 'Sébastien Goepfert' },
      ],
    },
    {
      id: '3',
      slug: 'kalakuta-film',
      title: 'Kalakuta',
      titleOriginal: 'Kalakuta',
      poster: '/images/films/kalakuta.jpg',
      synopsis: 'Une odyssée musicale à travers l\'Afrique des rythmes. Ce film documentaire vous emmène à la découverte de la République de Kalakuta, l\'univers musical créé par Fela Kuti, et explore son influence sur la musique africaine contemporaine.',
      duration: 120,
      year: 2024,
      genre: 'Documentaire',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Meilleur Documentaire Festival Vues d\'Afrique', year: 2024 },
      ]),
      cast: [],
      crew: [
        { id: 'cr7', role: 'Réalisateur', memberName: 'Rampa Yé' },
        { id: 'cr8', role: 'Producteur', memberName: 'Kader Diabaté' },
      ],
    },
    {
      id: '4',
      slug: 'le-nouveau-film',
      title: 'Le Nouveau',
      titleOriginal: 'Le Nouveau',
      poster: '/images/films/le-nouveau.jpg',
      synopsis: 'L\'arrivée d\'un nouvel élève bouleverse une classe de terminale. Entre amitiés naissantes et rivalités, ce film de fiction explore les défis de l\'adolescence dans un lycée d\'Abidjan.',
      duration: 88,
      year: 2023,
      genre: 'Comédie',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: null,
      cast: [
        { id: 'c6', actorName: 'Aristide Koffi', characterName: 'Kofi' },
        { id: 'c7', actorName: 'Fatou Sylla', characterName: 'Amoin' },
        { id: 'c8', actorName: 'Yao Konan', characterName: 'Serge' },
      ],
      crew: [
        { id: 'cr9', role: 'Réalisateur', memberName: 'Marina Nsengiyumva' },
      ],
    },
    {
      id: '5',
      slug: 'aya-de-yopougon-film',
      title: 'Aya de Yopougon',
      titleOriginal: 'Aya de Yopougon',
      poster: '/images/films/aya.jpg',
      synopsis: 'Adaptation de la célèbre bande dessinée ivoirienne de Marguerite Abouet. Ce film d\'animation suit les aventures d\'Aya, une jeune fille de 19 ans vivant à Yopougon dans les années 1970.',
      duration: 92,
      year: 2023,
      genre: 'Animation',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'César du Meilleur Film d\'Animation', year: 2014 },
        { name: 'Prix du Public Annecy', year: 2013 },
      ]),
      cast: [
        { id: 'c9', actorName: 'Aïssa Maïga', characterName: 'Aya (voix)' },
        { id: 'c10', actorName: 'Jacky Ido', characterName: 'Hervé (voix)' },
      ],
      crew: [
        { id: 'cr10', role: 'Réalisateur', memberName: 'Marguerite Abouet' },
        { id: 'cr11', role: 'Co-réalisateur', memberName: 'Clément Oubrerie' },
      ],
    },
    {
      id: '6',
      slug: 'bronx-barbes-film',
      title: 'Bronx-Barbès',
      titleOriginal: 'Bronx-Barbès',
      poster: '/images/films/bronx.jpg',
      synopsis: 'Deux mondes s\'entrechoquent dans ce drame social puissant. L\'histoire de deux jeunes hommes issus de quartiers différents qui se retrouvent liés par le destin dans les rues d\'Abidjan.',
      duration: 105,
      year: 2024,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: null,
      cast: [
        { id: 'c11', actorName: 'Fargass Assandé', characterName: 'Driss' },
        { id: 'c12', actorName: 'Abdoul Karim Konaté', characterName: 'Brahim' },
      ],
      crew: [
        { id: 'cr12', role: 'Réalisateur', memberName: 'Eliane de Latour' },
      ],
    },
    {
      id: '7',
      slug: 'caramel-film',
      title: 'Caramel',
      titleOriginal: 'Caramel',
      poster: '/images/films/caramel.jpg',
      synopsis: 'Une comédie romantique au cœur d\'Abidjan. Sarah, une jeune femme ambitieuse, ouvre un salon de beauté et voit sa vie bouleversée par l\'arrivée d\'un client mystérieux.',
      duration: 98,
      year: 2023,
      genre: 'Comédie',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Meilleure Comédie Festival d\'Abidjan', year: 2023 },
      ]),
      cast: [
        { id: 'c13', actorName: 'Marlène Koffi', characterName: 'Sarah' },
        { id: 'c14', actorName: 'Didier Adja', characterName: 'Marc' },
      ],
      crew: [
        { id: 'cr13', role: 'Réalisateur', memberName: 'Marlène Koffi' },
      ],
    },
    {
      id: '8',
      slug: 'le-pardon-film',
      title: 'Le Pardon',
      titleOriginal: 'Le Pardon',
      poster: '/images/films/pardon.jpg',
      synopsis: 'Un voyage émotionnel à travers la réconciliation familiale. Après vingt ans d\'exil, un homme retourne dans son village natal pour affronter son passé et se réconcilier avec sa famille.',
      duration: 115,
      year: 2024,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: JSON.stringify([
        { name: 'Prix Spécial du Jury FESPACO', year: 2024 },
      ]),
      cast: [
        { id: 'c15', actorName: 'Venance Konan', characterName: 'Kouadio' },
        { id: 'c16', actorName: 'Aminata Dosso', characterName: 'Aminata' },
      ],
      crew: [
        { id: 'cr14', role: 'Réalisateur', memberName: 'Sidiki Bakaba' },
      ],
    },
    {
      id: '9',
      slug: 'action-force-film',
      title: 'Action Force',
      titleOriginal: 'Action Force',
      poster: '/images/films/action.jpg',
      synopsis: 'Un film d\'action trépidant qui suit une équipe d\'élite des forces de l\'ordre dans leur lutte contre le crime organisé à Abidjan. Effets spéciaux impressionnants et cascades à couper le souffle.',
      duration: 125,
      year: 2024,
      genre: 'Action',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: null,
      cast: [
        { id: 'c17', actorName: 'Koffi Olomide', characterName: 'Commandant Touré' },
        { id: 'c18', actorName: 'Claudia Tagbo', characterName: 'Lieutenant Kone' },
      ],
      crew: [
        { id: 'cr15', role: 'Réalisateur', memberName: 'Tahirou Tasséré Ouedraogo' },
      ],
    },
    {
      id: '10',
      slug: 'les-enfants-du-soleil-film',
      title: 'Les Enfants du Soleil',
      titleOriginal: 'Les Enfants du Soleil',
      poster: '/images/films/soleil.jpg',
      synopsis: 'Documentaire poignant sur la vie des enfants travaillant dans les plantations de cacao de Côte d\'Ivoire. Un regard sans concession sur une réalité trop souvent ignorée.',
      duration: 85,
      year: 2022,
      genre: 'Documentaire',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: JSON.stringify([
        { name: 'Grand Prix Documentaire Cannes', year: 2022 },
        { name: 'Prix Amnesty International', year: 2022 },
      ]),
      cast: [],
      crew: [
        { id: 'cr16', role: 'Réalisateur', memberName: 'Mamadou Dia' },
      ],
    },
    {
      id: '11',
      slug: 'adama-film',
      title: 'Adama',
      titleOriginal: 'Adama',
      poster: '/images/films/adama.jpg',
      synopsis: 'Un film d\'animation époustouflant qui suit le voyage d\'un jeune garçon africain à travers l\'Europe de la Première Guerre mondiale. Une quête initiatique magnifique.',
      duration: 82,
      year: 2022,
      genre: 'Animation',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Meilleur Premier Film Annecy', year: 2015 },
      ]),
      cast: [
        { id: 'c19', actorName: 'Azize Diabaté', characterName: 'Adama (voix)' },
        { id: 'c20', actorName: 'Oxmo Puccino', characterName: 'Narrateur (voix)' },
      ],
      crew: [
        { id: 'cr17', role: 'Réalisateur', memberName: 'Simon Rouby' },
      ],
    },
    {
      id: '12',
      slug: 'bijou-film',
      title: 'Bijou',
      titleOriginal: 'Bijou',
      poster: '/images/films/bijou.jpg',
      synopsis: 'Une comédie sentimentale rafraîchissante sur les mésaventures amoureuses d\'une jeune femme qui découvre que le véritable trésor de la vie n\'est pas celui qu\'elle croyait chercher.',
      duration: 90,
      year: 2023,
      genre: 'Comédie',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: null,
      cast: [
        { id: 'c21', actorName: 'Micheline Gbangbo', characterName: 'Bijou' },
        { id: 'c22', actorName: 'Eugène Koffi', characterName: 'Roméo' },
      ],
      crew: [
        { id: 'cr18', role: 'Réalisateur', memberName: 'Eugène Koffi' },
      ],
    },
  ];

  // Apply filters
  let filtered = allFilms;

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(film => 
      film.title.toLowerCase().includes(searchLower) ||
      film.titleOriginal?.toLowerCase().includes(searchLower)
    );
  }

  if (genre) {
    filtered = filtered.filter(film => 
      film.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (year) {
    filtered = filtered.filter(film => film.year === parseInt(year));
  }

  return filtered;
}
