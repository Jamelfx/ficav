import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const film = await db.film.findUnique({
      where: { slug },
      include: {
        association: {
          select: { name: true, slug: true },
        },
        director: {
          select: { name: true, avatar: true, bio: true },
        },
        cast: {
          orderBy: { characterName: 'asc' },
        },
        crew: {
          orderBy: { role: 'asc' },
        },
      },
    });

    if (film) {
      return NextResponse.json(film);
    }

    // Return sample data if not found in database
    const sampleFilm = getSampleFilmBySlug(slug);
    if (sampleFilm) {
      return NextResponse.json(sampleFilm);
    }

    return NextResponse.json({ error: 'Film not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching film:', error);
    const { slug } = await params;
    const sampleFilm = getSampleFilmBySlug(slug);
    if (sampleFilm) {
      return NextResponse.json(sampleFilm);
    }
    return NextResponse.json({ error: 'Film not found' }, { status: 404 });
  }
}

function getSampleFilmBySlug(slug: string) {
  const films: Record<string, any> = {
    'run-film': {
      id: '1',
      slug: 'run-film',
      title: 'Run',
      titleOriginal: 'Run',
      poster: '/images/films/run.jpg',
      synopsis: 'Un thriller captivant qui explore les défis de la jeunesse africaine moderne. Dans les rues d\'Abidjan, un jeune homme se retrouve pris dans une course contre la montre pour sauver sa famille. Ce film poignant aborde les thèmes de la survie, de l\'amitié et du sacrifice dans un contexte urbain contemporain. L\'histoire nous plonge dans l\'univers vibrant et parfois dangereux d\'Abidjan, où Kouassi, jeune livreur à moto, se retrouve impliqué malgré lui dans une affaire qui dépasse son entendement. Sa course effrénée à travers la ville devient une véritable odyssée où chaque rencontre, chaque décision peut lui coûter la vie ou celle de ses proches.',
      duration: 110,
      year: 2024,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Étalon d\'Or FESPACO 2024', year: 2024 },
        { name: 'Meilleur Film Panafrican Film Festival', year: 2024 },
        { name: 'Prix de la Critique Internationale', year: 2024 },
      ]),
      association: { name: 'ARPA', slug: 'arpa' },
      director: {
        name: 'Philip Lacôte',
        avatar: '/images/federation/president.png',
        bio: 'Réalisateur ivoirien reconnu internationalement pour son approche novatrice du cinéma africain.',
      },
      cast: [
        { id: 'c1', actorName: 'Jean-Baptiste Anoumou', characterName: 'Kouassi' },
        { id: 'c2', actorName: 'Marie-Louise Asseu', characterName: 'Aya' },
        { id: 'c3', actorName: 'Serge Kanyou', characterName: 'Moussa' },
        { id: 'c23', actorName: 'Isabelle Koffi', characterName: 'Mère de Kouassi' },
        { id: 'c24', actorName: 'Abdoulaye Diallo', characterName: 'Inspecteur Touré' },
      ],
      crew: [
        { id: 'cr1', role: 'Réalisateur', memberName: 'Philip Lacôte' },
        { id: 'cr2', role: 'Directeur de la Photographie', memberName: 'Julien Rouch' },
        { id: 'cr3', role: 'Monteur', memberName: 'Marie-Hélène Dozo' },
        { id: 'cr4', role: 'Scénariste', memberName: 'Philip Lacôte' },
        { id: 'cr19', role: 'Producteur', memberName: 'Boris Mendy' },
        { id: 'cr20', role: 'Directeur Artistique', memberName: "Armand N'Guessan" },
        { id: 'cr21', role: 'Costumier', memberName: 'Mireille Mossi' },
        { id: 'cr22', role: 'Compositeur', memberName: 'Manu Dibango Jr.' },
      ],
    },
    'philo-film': {
      id: '2',
      slug: 'philo-film',
      title: 'Philo',
      titleOriginal: 'Philo',
      poster: '/images/films/philo.jpg',
      synopsis: 'L\'histoire touchante d\'un jeune professeur qui arrive dans un village reculé de Côte d\'Ivoire et transforme la vie de ses élèves. À travers son dévouement, il réussit à réconcilier les traditions ancestrales avec l\'éducation moderne. Philo, jeune diplômé de l\'université de Cocody, fait le choix inhabituel de quitter Abidjan pour enseigner dans un village du nord. Face à des infrastructures précaires et une communauté méfiante, il invente des méthodes pédagogiques créatives qui lui permettront de gagner le cœur des villageois.',
      duration: 95,
      year: 2023,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Prix du Public Festival de Namur', year: 2023 },
        { name: 'Meilleur Acteur Festival d\'Abidjan', year: 2023 },
      ]),
      association: { name: 'ARPACI', slug: 'arpaci' },
      director: {
        name: 'Abderrahmane Sissako',
        avatar: '/images/federation/vp.png',
        bio: 'Cinéaste mauritano-ivoirien, figure emblématique du cinéma africain contemporain.',
      },
      cast: [
        { id: 'c4', actorName: 'Didier G. Agba', characterName: 'Philo' },
        { id: 'c5', actorName: 'Blandine Yameogo', characterName: 'Adama' },
        { id: 'c25', actorName: "Thierry N'Goran", characterName: 'Chef du village' },
        { id: 'c26', actorName: 'Aminata Ouattara', characterName: 'Fatou' },
      ],
      crew: [
        { id: 'cr5', role: 'Réalisateur', memberName: 'Abderrahmane Sissako' },
        { id: 'cr6', role: 'Directeur de la Photographie', memberName: 'Sébastien Goepfert' },
        { id: 'cr23', role: 'Scénariste', memberName: 'Valérie Oka' },
        { id: 'cr24', role: 'Producteur', memberName: 'Denis Cougnenc' },
      ],
    },
    'kalakuta-film': {
      id: '3',
      slug: 'kalakuta-film',
      title: 'Kalakuta',
      titleOriginal: 'Kalakuta',
      poster: '/images/films/kalakuta.jpg',
      synopsis: 'Une odyssée musicale à travers l\'Afrique des rythmes. Ce film documentaire vous emmène à la découverte de la République de Kalakuta, l\'univers musical créé par Fela Kuti, et explore son influence sur la musique africaine contemporaine. À travers des images d\'archives exceptionnelles et des témoignages de musiciens contemporains, le film retrace l\'héritage de l\'Afrobeat et son impact sur plusieurs générations d\'artistes.',
      duration: 120,
      year: 2024,
      genre: 'Documentaire',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Meilleur Documentaire Festival Vues d\'Afrique', year: 2024 },
        { name: 'Prix de la Musique Documentary Film Festival', year: 2024 },
      ]),
      association: { name: 'ARPA', slug: 'arpa' },
      director: {
        name: 'Rampa Yé',
        avatar: '/images/federation/secretary.png',
        bio: 'Documentariste et anthropologue, spécialisé dans la préservation du patrimoine musical africain.',
      },
      cast: [],
      crew: [
        { id: 'cr7', role: 'Réalisateur', memberName: 'Rampa Yé' },
        { id: 'cr8', role: 'Producteur', memberName: 'Kader Diabaté' },
        { id: 'cr25', role: 'Chercheur', memberName: 'Dr. Amadou Traoré' },
        { id: 'cr26', role: 'Monteur', memberName: 'Sébastien Duhem' },
      ],
    },
    'le-nouveau-film': {
      id: '4',
      slug: 'le-nouveau-film',
      title: 'Le Nouveau',
      titleOriginal: 'Le Nouveau',
      poster: '/images/films/le-nouveau.jpg',
      synopsis: 'L\'arrivée d\'un nouvel élève bouleverse une classe de terminale. Entre amitiés naissantes et rivalités, ce film de fiction explore les défis de l\'adolescence dans un lycée d\'Abidjan. Kofi, arrivé d\'une petite ville de l\'intérieur, doit s\'adapter à son nouvel environnement tout en préservant son identité. Le film aborde avec finesse les questions d\'intégration, de harcèlement scolaire et de construction identitaire.',
      duration: 88,
      year: 2023,
      genre: 'Comédie',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: null,
      association: { name: 'GAM - Guild of Actors', slug: 'gam' },
      director: {
        name: 'Marina Nsengiyumva',
        avatar: '/images/federation/treasurer.png',
        bio: 'Réalisatrice burundaise installée en Côte d\'Ivoire, spécialisée dans le cinéma jeunesse.',
      },
      cast: [
        { id: 'c6', actorName: 'Aristide Koffi', characterName: 'Kofi' },
        { id: 'c7', actorName: 'Fatou Sylla', characterName: 'Amoin' },
        { id: 'c8', actorName: 'Yao Konan', characterName: 'Serge' },
        { id: 'c27', actorName: 'Clarisse Allou', characterName: 'Professeure principal' },
      ],
      crew: [
        { id: 'cr9', role: 'Réalisateur', memberName: 'Marina Nsengiyumva' },
        { id: 'cr27', role: 'Scénariste', memberName: 'Jean-Louis Kouadio' },
      ],
    },
    'aya-de-yopougon-film': {
      id: '5',
      slug: 'aya-de-yopougon-film',
      title: 'Aya de Yopougon',
      titleOriginal: 'Aya de Yopougon',
      poster: '/images/films/aya.jpg',
      synopsis: 'Adaptation de la célèbre bande dessinée ivoirienne de Marguerite Abouet. Ce film d\'animation suit les aventures d\'Aya, une jeune fille de 19 ans vivant à Yopougon dans les années 1970. Entre ses deux meilleures amies, les garçons du quartier et ses ambitions de devenir médecin, Aya navigue avec humour et intelligence dans l\'Abidjan des Trente Glorieuses.',
      duration: 92,
      year: 2023,
      genre: 'Animation',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'César du Meilleur Film d\'Animation', year: 2014 },
        { name: 'Prix du Public Annecy', year: 2013 },
        { name: 'Meilleur Film d\'Animation Festival d\'Abidjan', year: 2014 },
      ]),
      association: null,
      director: {
        name: 'Marguerite Abouet',
        avatar: null,
        bio: 'Scénariste et réalisatrice ivoirienne, créatrice de la célèbre série BD Aya de Yopougon.',
      },
      cast: [
        { id: 'c9', actorName: 'Aïssa Maïga', characterName: 'Aya (voix)' },
        { id: 'c10', actorName: 'Jacky Ido', characterName: 'Hervé (voix)' },
        { id: 'c28', actorName: 'Dorothée Pousséo', characterName: 'Adjoua (voix)' },
        { id: 'c29', actorName: 'Evelyne Ily Juhen', characterName: 'Bintou (voix)' },
      ],
      crew: [
        { id: 'cr10', role: 'Réalisateur', memberName: 'Marguerite Abouet' },
        { id: 'cr11', role: 'Co-réalisateur', memberName: 'Clément Oubrerie' },
        { id: 'cr28', role: 'Directrice Artistique', memberName: 'Clément Oubrerie' },
      ],
    },
    'bronx-barbes-film': {
      id: '6',
      slug: 'bronx-barbes-film',
      title: 'Bronx-Barbès',
      titleOriginal: 'Bronx-Barbès',
      poster: '/images/films/bronx.jpg',
      synopsis: 'Deux mondes s\'entrechoquent dans ce drame social puissant. L\'histoire de deux jeunes hommes issus de quartiers différents qui se retrouvent liés par le destin dans les rues d\'Abidjan. Driss, jeune venu du quartier huppé de Cocody, et Brahim, des rues de Treichville, se rencontrent dans des circonstances tragiques qui les forceront à reconsidérer leurs préjugés.',
      duration: 105,
      year: 2024,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: null,
      association: { name: 'ARPA', slug: 'arpa' },
      director: {
        name: 'Eliane de Latour',
        avatar: null,
        bio: 'Anthropologue et cinéaste française, spécialisée dans les récits sur l\'Afrique urbaine.',
      },
      cast: [
        { id: 'c11', actorName: 'Fargass Assandé', characterName: 'Driss' },
        { id: 'c12', actorName: 'Abdoul Karim Konaté', characterName: 'Brahim' },
        { id: 'c30', actorName: 'Djédjé Apali', characterName: 'Ousmane' },
      ],
      crew: [
        { id: 'cr12', role: 'Réalisateur', memberName: 'Eliane de Latour' },
        { id: 'cr29', role: 'Scénariste', memberName: 'Eliane de Latour' },
      ],
    },
    'caramel-film': {
      id: '7',
      slug: 'caramel-film',
      title: 'Caramel',
      titleOriginal: 'Caramel',
      poster: '/images/films/caramel.jpg',
      synopsis: 'Une comédie romantique au cœur d\'Abidjan. Sarah, une jeune femme ambitieuse, ouvre un salon de beauté et voit sa vie bouleversée par l\'arrivée d\'un client mystérieux. Entre rebondissements cocasses et situations rocambolesques, Sarah découvrira que l\'amour frappe parfois quand on ne s\'y attend pas.',
      duration: 98,
      year: 2023,
      genre: 'Comédie',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Meilleure Comédie Festival d\'Abidjan', year: 2023 },
      ]),
      association: { name: 'GAM - Guild of Actors', slug: 'gam' },
      director: {
        name: 'Marlène Koffi',
        avatar: null,
        bio: 'Réalisatrice et productrice ivoirienne, pionnière de la comédie romantique africaine.',
      },
      cast: [
        { id: 'c13', actorName: 'Marlène Koffi', characterName: 'Sarah' },
        { id: 'c14', actorName: 'Didier Adja', characterName: 'Marc' },
        { id: 'c31', actorName: 'Reine Sessouma', characterName: 'Aminata' },
      ],
      crew: [
        { id: 'cr13', role: 'Réalisateur', memberName: 'Marlène Koffi' },
        { id: 'cr30', role: 'Productrice', memberName: 'Marlène Koffi' },
      ],
    },
    'le-pardon-film': {
      id: '8',
      slug: 'le-pardon-film',
      title: 'Le Pardon',
      titleOriginal: 'Le Pardon',
      poster: '/images/films/pardon.jpg',
      synopsis: 'Un voyage émotionnel à travers la réconciliation familiale. Après vingt ans d\'exil, un homme retourne dans son village natal pour affronter son passé et se réconcilier avec sa famille. Kouadio avait quitté son village suite à un drame familial. Devenu un homme d\'affaires prospère à l\'étranger, il décide de revenir pour faire la paix avec ses racines.',
      duration: 115,
      year: 2024,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: JSON.stringify([
        { name: 'Prix Spécial du Jury FESPACO', year: 2024 },
      ]),
      association: { name: 'ARPACI', slug: 'arpaci' },
      director: {
        name: 'Sidiki Bakaba',
        avatar: null,
        bio: 'Légende du cinéma ivoirien, acteur et réalisateur de renommée internationale.',
      },
      cast: [
        { id: 'c15', actorName: 'Venance Konan', characterName: 'Kouadio' },
        { id: 'c16', actorName: 'Aminata Dosso', characterName: 'Aminata' },
        { id: 'c32', actorName: 'Alexis Kadio', characterName: 'Père de Kouadio' },
      ],
      crew: [
        { id: 'cr14', role: 'Réalisateur', memberName: 'Sidiki Bakaba' },
        { id: 'cr31', role: 'Producteur', memberName: 'Fidelis Ojo' },
      ],
    },
    'action-force-film': {
      id: '9',
      slug: 'action-force-film',
      title: 'Action Force',
      titleOriginal: 'Action Force',
      poster: '/images/films/action.jpg',
      synopsis: 'Un film d\'action trépidant qui suit une équipe d\'élite des forces de l\'ordre dans leur lutte contre le crime organisé à Abidjan. Effets spéciaux impressionnants et cascades à couper le souffle pour ce thriller qui tient le spectateur en haleine du début à la fin.',
      duration: 125,
      year: 2024,
      genre: 'Action',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: null,
      association: null,
      director: {
        name: 'Tahirou Tasséré Ouedraogo',
        avatar: null,
        bio: 'Réalisateur burkinabè reconnu pour ses films d\'action à grand spectacle.',
      },
      cast: [
        { id: 'c17', actorName: 'Koffi Olomide', characterName: 'Commandant Touré' },
        { id: 'c18', actorName: 'Claudia Tagbo', characterName: 'Lieutenant Kone' },
        { id: 'c33', actorName: 'Stéphane Soo', characterName: 'Agent Kone' },
      ],
      crew: [
        { id: 'cr15', role: 'Réalisateur', memberName: 'Tahirou Tasséré Ouedraogo' },
        { id: 'cr32', role: 'Producteur', memberName: 'Mamadou Diabaté' },
      ],
    },
    'les-enfants-du-soleil-film': {
      id: '10',
      slug: 'les-enfants-du-soleil-film',
      title: 'Les Enfants du Soleil',
      titleOriginal: 'Les Enfants du Soleil',
      poster: '/images/films/soleil.jpg',
      synopsis: 'Documentaire poignant sur la vie des enfants travaillant dans les plantations de cacao de Côte d\'Ivoire. Un regard sans concession sur une réalité trop souvent ignorée. Le film suit plusieurs enfants sur plusieurs mois, révélant leurs espoirs, leurs luttes et leur dignité face à l\'adversité.',
      duration: 85,
      year: 2022,
      genre: 'Documentaire',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: JSON.stringify([
        { name: 'Grand Prix Documentaire Cannes', year: 2022 },
        { name: 'Prix Amnesty International', year: 2022 },
        { name: 'Meilleur Documentaire Festival de Milan', year: 2022 },
      ]),
      association: null,
      director: {
        name: 'Mamadou Dia',
        avatar: null,
        bio: 'Documentariste sénégalais, primé internationalement pour ses œuvres sociales.',
      },
      cast: [],
      crew: [
        { id: 'cr16', role: 'Réalisateur', memberName: 'Mamadou Dia' },
        { id: 'cr33', role: 'Directrice de la Photo', memberName: 'Mira Nair' },
      ],
    },
    'adama-film': {
      id: '11',
      slug: 'adama-film',
      title: 'Adama',
      titleOriginal: 'Adama',
      poster: '/images/films/adama.jpg',
      synopsis: 'Un film d\'animation époustouflant qui suit le voyage d\'un jeune garçon africain à travers l\'Europe de la Première Guerre mondiale. Une quête initiatique magnifique. Adama, 12 ans, quitte son village pour retrouver son frère aîné parti combattre au front. Son voyage le mènera des terres africaines aux tranchées de Verdun.',
      duration: 82,
      year: 2022,
      genre: 'Animation',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      awards: JSON.stringify([
        { name: 'Meilleur Premier Film Annecy', year: 2015 },
        { name: 'Prix du Public Festival d\'Annecy', year: 2015 },
      ]),
      association: null,
      director: {
        name: 'Simon Rouby',
        avatar: null,
        bio: 'Réalisateur français, spécialisé dans l\'animation et les techniques mixtes.',
      },
      cast: [
        { id: 'c19', actorName: 'Azize Diabaté', characterName: 'Adama (voix)' },
        { id: 'c20', actorName: 'Oxmo Puccino', characterName: 'Narrateur (voix)' },
        { id: 'c34', actorName: 'Pascale Arbillot', characterName: 'Emma (voix)' },
      ],
      crew: [
        { id: 'cr17', role: 'Réalisateur', memberName: 'Simon Rouby' },
        { id: 'cr34', role: 'Scénariste', memberName: 'Julie Leruste' },
      ],
    },
    'bijou-film': {
      id: '12',
      slug: 'bijou-film',
      title: 'Bijou',
      titleOriginal: 'Bijou',
      poster: '/images/films/bijou.jpg',
      synopsis: 'Une comédie sentimentale rafraîchissante sur les mésaventures amoureuses d\'une jeune femme qui découvre que le véritable trésor de la vie n\'est pas celui qu\'elle croyait chercher. Bijou, jeune femme ambitieuse, pense avoir trouvé l\'homme parfait jusqu\'à ce que le destin lui réserve des surprises.',
      duration: 90,
      year: 2023,
      genre: 'Comédie',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: null,
      awards: null,
      association: { name: 'GAM - Guild of Actors', slug: 'gam' },
      director: {
        name: 'Eugène Koffi',
        avatar: null,
        bio: 'Réalisateur ivoirien connu pour ses comédies populaires.',
      },
      cast: [
        { id: 'c21', actorName: 'Micheline Gbangbo', characterName: 'Bijou' },
        { id: 'c22', actorName: 'Eugène Koffi', characterName: 'Roméo' },
        { id: 'c35', actorName: 'Benedicta Gafah', characterName: 'Fatou' },
      ],
      crew: [
        { id: 'cr18', role: 'Réalisateur', memberName: 'Eugène Koffi' },
        { id: 'cr35', role: 'Producteur', memberName: 'Prosper Koffi' },
      ],
    },
  };

  return films[slug] || null;
}
