import { PrismaClient, UserRole, AssociationStatus, EventType, JobType, BadgeType, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Associations
  const arp = await prisma.association.create({
    data: {
      slug: 'arp',
      name: 'Association des Réalisateurs de Côte d\'Ivoire',
      logo: '/images/associations/arp.png',
      description: 'Regroupe les professionnels de la réalisation cinématographique et audiovisuelle ivoirienne.',
      category: 'Réalisation',
      president: 'Jean-Claude Brou',
      vicePresident: 'Aminata Diallo',
      secretary: 'Kouamé Yao',
      treasurer: 'Marie Koné',
      address: 'Rue des Jardins, Plateau',
      city: 'Abidjan',
      phone: '+225 07 00 00 01',
      email: 'contact@arp-ci.org',
      website: 'https://arp-ci.org',
      latitude: 5.3364,
      longitude: -4.0267,
      status: AssociationStatus.ACTIVE,
    },
  });

  const apci = await prisma.association.create({
    data: {
      slug: 'apci',
      name: 'Association des Producteurs de Côte d\'Ivoire',
      logo: '/images/associations/apci.png',
      description: 'Organisation des producteurs de films et contenus audiovisuels.',
      category: 'Production',
      president: 'Ibrahim Coulibaly',
      vicePresident: 'Fatou Ouattara',
      secretary: 'Seydou Koné',
      treasurer: 'Awa Touré',
      address: 'Boulevard de la République, Cocody',
      city: 'Abidjan',
      phone: '+225 07 00 00 02',
      email: 'contact@apci-ci.org',
      website: 'https://apci-ci.org',
      latitude: 5.3500,
      longitude: -3.9833,
      status: AssociationStatus.ACTIVE,
    },
  });

  const aact = await prisma.association.create({
    data: {
      slug: 'aact',
      name: 'Association des Acteurs de Côte d\'Ivoire',
      logo: '/images/associations/aact.png',
      description: 'Fédération des acteurs et comédiens professionnels.',
      category: 'Interprétation',
      president: 'Didier Gnodji',
      vicePresident: 'Binta Zahra',
      secretary: 'Yao Koffi',
      treasurer: 'Adjoua Kouassi',
      address: 'Avenue Chardy, Treichville',
      city: 'Abidjan',
      phone: '+225 07 00 00 03',
      email: 'contact@aact-ci.org',
      website: 'https://aact-ci.org',
      latitude: 5.2944,
      longitude: -4.0111,
      status: AssociationStatus.ACTIVE,
    },
  });

  const atci = await prisma.association.create({
    data: {
      slug: 'atci',
      name: 'Association des Techniciens de Côte d\'Ivoire',
      logo: '/images/associations/atci.png',
      description: 'Regroupement des techniciens du cinéma et de l\'audiovisuel.',
      category: 'Technique',
      president: 'Kouadio N\'Goran',
      vicePresident: 'Estelle Gnamien',
      secretary: 'Modeste Aya',
      treasurer: 'Léon Konan',
      address: 'Rue 12, Marcory',
      city: 'Abidjan',
      phone: '+225 07 00 00 04',
      email: 'contact@atci-ci.org',
      website: 'https://atci-ci.org',
      latitude: 5.3075,
      longitude: -3.9911,
      status: AssociationStatus.ACTIVE,
    },
  });

  const asc = await prisma.association.create({
    data: {
      slug: 'asc',
      name: 'Association des Scénaristes de Côte d\'Ivoire',
      logo: '/images/associations/asc.png',
      description: 'Organisation des scénaristes et auteurs de contenus.',
      category: 'Écriture',
      president: 'Michèle Koffi',
      vicePresident: 'Soro Souleymane',
      secretary: 'N\'Guessan Yao',
      treasurer: 'Anne-Marie Brou',
      address: 'Rue du Commerce, Abobo',
      city: 'Abidjan',
      phone: '+225 07 00 00 05',
      email: 'contact@asc-ci.org',
      website: 'https://asc-ci.org',
      latitude: 5.4272,
      longitude: -4.0158,
      status: AssociationStatus.ACTIVE,
    },
  });

  console.log('Created associations');

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ficav.ci',
      name: 'Admin FICAV',
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  });

  const director1 = await prisma.user.create({
    data: {
      email: 'philippe.koffi@email.ci',
      name: 'Philippe Koffi',
      avatar: '/images/users/director1.jpg',
      bio: 'Réalisateur primé avec 15 ans d\'expérience dans le cinéma ivoirien.',
      phone: '+225 07 11 11 11',
      role: UserRole.PROFESSIONAL,
      isVerified: true,
      skills: JSON.stringify(['Réalisation', 'Scénario', 'Montage']),
      associationId: arp.id,
      badges: {
        create: {
          type: BadgeType.CERTIFIED_TECHNICIAN,
          expiresAt: new Date('2025-12-31'),
        },
      },
    },
  });

  const director2 = await prisma.user.create({
    data: {
      email: 'marie.toure@email.ci',
      name: 'Marie Touré',
      avatar: '/images/users/director2.jpg',
      bio: 'Réalisatrice documentariste, spécialisée dans les documentaires sociaux.',
      phone: '+225 07 22 22 22',
      role: UserRole.PROFESSIONAL,
      isVerified: true,
      skills: JSON.stringify(['Documentaire', 'Réalisation', 'Production']),
      associationId: arp.id,
      badges: {
        create: [
          {
            type: BadgeType.CERTIFIED_TECHNICIAN,
            expiresAt: new Date('2025-12-31'),
          },
          {
            type: BadgeType.VERIFIED_PROFESSIONAL,
          },
        ],
      },
    },
  });

  const actor1 = await prisma.user.create({
    data: {
      email: 'didier.kouame@email.ci',
      name: 'Didier Kouamé',
      avatar: '/images/users/actor1.jpg',
      bio: 'Acteur principal dans plus de 20 films ivoiriens.',
      phone: '+225 07 33 33 33',
      role: UserRole.PROFESSIONAL,
      isVerified: true,
      skills: JSON.stringify(['Comédie', 'Dramaturgie', 'Doublage']),
      associationId: aact.id,
      badges: {
        create: {
          type: BadgeType.OFFICIAL_MEMBER,
          expiresAt: new Date('2025-12-31'),
        },
      },
    },
  });

  const producer1 = await prisma.user.create({
    data: {
      email: 'ibrahim.kone@email.ci',
      name: 'Ibrahim Koné',
      avatar: '/images/users/producer1.jpg',
      bio: 'Producteur exécutif, fondateur de Kone Productions.',
      phone: '+225 07 44 44 44',
      role: UserRole.PROFESSIONAL,
      isVerified: true,
      skills: JSON.stringify(['Production', 'Distribution', 'Financement']),
      associationId: apci.id,
    },
  });

  console.log('Created users');

  // Create Films
  const film1 = await prisma.film.create({
    data: {
      slug: 'run-2023',
      title: 'Run',
      titleOriginal: 'Run',
      poster: '/images/films/run.jpg',
      synopsis: 'L\'histoire poignante d\'un jeune coureur de rue qui rêve de devenir champion. Entre obstacles et persévérance, il découvre que le véritable parcours est celui de l\'âme.',
      duration: 115,
      year: 2023,
      genre: 'Drame',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://youtube.com/watch?v=example1',
      awards: JSON.stringify(['Étalon d\'or FESPACO 2023', 'Meilleur film africain - Cannes 2023']),
      isPublished: true,
      releaseDate: new Date('2023-06-15'),
      directorId: director1.id,
      associationId: arp.id,
      cast: {
        create: [
          { characterName: 'Kouamé', actorName: 'Didier Kouamé' },
          { characterName: 'Aminata', actorName: 'Fatou Zahra' },
          { characterName: 'Papa Diallo', actorName: 'Ibrahim Bamba' },
        ],
      },
      crew: {
        create: [
          { role: 'Directeur de la photographie', memberName: 'Sébastien Aya' },
          { role: 'Monteur', memberName: 'Caroline Brou' },
          { role: 'Chef décorateur', memberName: 'Emmanuel Koné' },
          { role: 'Compositeur', memberName: 'Alpha Blondy' },
        ],
      },
    },
  });

  const film2 = await prisma.film.create({
    data: {
      slug: 'les-birds-2022',
      title: 'Les Birds',
      titleOriginal: 'Les Birds',
      poster: '/images/films/birds.jpg',
      synopsis: 'Une comédie sociale qui explore les défis de la jeunesse ivoirienne à travers le prisme du football de rue.',
      duration: 98,
      year: 2022,
      genre: 'Comédie',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://youtube.com/watch?v=example2',
      isPublished: true,
      releaseDate: new Date('2022-12-01'),
      directorId: director2.id,
      associationId: arp.id,
      cast: {
        create: [
          { characterName: 'Mamadou', actorName: 'Youssouf Djaoro' },
          { characterName: 'Fatou', actorName: 'Maimouna Hélène Diarra' },
        ],
      },
      crew: {
        create: [
          { role: 'Directeur de la photographie', memberName: 'Abdoulaye Koné' },
          { role: 'Monteur', memberName: 'Jacqueline Zadi' },
        ],
      },
    },
  });

  const film3 = await prisma.film.create({
    data: {
      slug: 'adama-2021',
      title: 'Adama',
      titleOriginal: 'Adama',
      poster: '/images/films/adama.jpg',
      synopsis: 'Un jeune garçon part à la recherche de son frère aîné, soldat pendant la Première Guerre mondiale.',
      duration: 87,
      year: 2021,
      genre: 'Animation',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://youtube.com/watch?v=example3',
      awards: JSON.stringify(['César du meilleur film d\'animation 2022']),
      isPublished: true,
      releaseDate: new Date('2021-10-20'),
      associationId: apci.id,
      cast: {
        create: [
          { characterName: 'Adama', actorName: 'Azize Diabaté' },
        ],
      },
      crew: {
        create: [
          { role: 'Réalisateur', memberName: 'Simon Rouby' },
          { role: 'Producteur', memberName: 'Plassard' },
        ],
      },
    },
  });

  const film4 = await prisma.film.create({
    data: {
      slug: 'bangui-2020',
      title: 'Bangui',
      titleOriginal: 'Bangui',
      poster: '/images/films/bangui.jpg',
      synopsis: 'Une exploration poétique de la vie dans un quartier populaire d\'Abidjan.',
      duration: 105,
      year: 2020,
      genre: 'Documentaire',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      isPublished: true,
      releaseDate: new Date('2020-03-15'),
      directorId: director2.id,
      associationId: arp.id,
    },
  });

  const film5 = await prisma.film.create({
    data: {
      slug: 'le-reveil-2024',
      title: 'Le Réveil',
      titleOriginal: 'Le Réveil',
      poster: '/images/films/reveil.jpg',
      synopsis: 'Un thriller politique qui dévoile les coulisses du pouvoir dans une Afrique fictive mais reconnaissable.',
      duration: 130,
      year: 2024,
      genre: 'Thriller',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      trailerUrl: 'https://youtube.com/watch?v=example5',
      isPublished: true,
      releaseDate: new Date('2024-02-14'),
      directorId: director1.id,
      associationId: arp.id,
      cast: {
        create: [
          { characterName: 'Le Président', actorName: 'Fargass Assandé' },
          { characterName: 'Le Journaliste', actorName: 'Didier Gnodji' },
        ],
      },
    },
  });

  console.log('Created films');

  // Create Events
  await prisma.event.createMany({
    data: [
      {
        slug: 'ficav-2024',
        title: 'Festival du Cinéma Ivoirien 2024',
        description: 'La 10ème édition du festival annuel du cinéma ivoirien. 10 jours de projections, rencontres et célébrations.',
        type: EventType.FESTIVAL,
        venue: 'Palais de la Culture',
        address: 'Boulevard de la République',
        city: 'Abidjan',
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-25'),
        image: '/images/events/ficav-2024.jpg',
        maxAttendees: 5000,
        isPublished: true,
        associationId: arp.id,
      },
      {
        slug: 'assemblee-generale-2024',
        title: 'Assemblée Générale Annuelle FICAV',
        description: 'Assemblée générale annuelle de la FICAV avec présentation du bilan et élection du nouveau bureau.',
        type: EventType.ASSEMBLY,
        venue: 'Hôtel Ivoire',
        address: 'Boulevard de la République, Plateau',
        city: 'Abidjan',
        startDate: new Date('2024-06-20'),
        endDate: new Date('2024-06-21'),
        image: '/images/events/ag-2024.jpg',
        maxAttendees: 300,
        isPublished: true,
      },
      {
        slug: 'formation-scenario-2024',
        title: 'Formation Écriture de Scénario',
        description: 'Masterclass de 5 jours sur l\'écriture de scénario avec des professionnels internationaux.',
        type: EventType.TRAINING,
        venue: 'Institut National des Arts',
        address: 'Abobo',
        city: 'Abidjan',
        startDate: new Date('2024-09-10'),
        endDate: new Date('2024-09-14'),
        image: '/images/events/formation-2024.jpg',
        maxAttendees: 50,
        isPublished: true,
        associationId: asc.id,
      },
      {
        slug: 'projection-run',
        title: 'Avant-première "Run"',
        description: 'Avant-première exclusive du film "Run" en présence de l\'équipe technique.',
        type: EventType.PROJECTION,
        venue: 'CanalOlympia',
        address: 'Bingerville',
        city: 'Abidjan',
        startDate: new Date('2024-06-10'),
        image: '/images/events/projection-run.jpg',
        maxAttendees: 500,
        isPublished: true,
        associationId: arp.id,
      },
      {
        slug: 'conference-industrie',
        title: 'Conférence "L\'Industrie du Cinéma Africain"',
        description: 'Table ronde sur les enjeux et perspectives de l\'industrie cinématographique africaine.',
        type: EventType.CONFERENCE,
        venue: 'Sofitel Abidjan Hôtel Ivoire',
        address: 'Plateau',
        city: 'Abidjan',
        startDate: new Date('2024-10-05'),
        image: '/images/events/conference.jpg',
        maxAttendees: 200,
        isPublished: true,
      },
    ],
  });

  console.log('Created events');

  // Create Jobs
  await prisma.job.createMany({
    data: [
      {
        slug: 'realisateur-projet-tv',
        title: 'Réalisateur pour série TV',
        description: 'Nous recherchons un réalisateur expérimenté pour une nouvelle série télévisée de 26 épisodes.',
        type: JobType.EMPLOI,
        location: 'Abidjan',
        salary: '1.500.000 FCFA/mois',
        deadline: new Date('2024-07-30'),
        requirements: JSON.stringify(['5 ans d\'expérience minimum', 'Portfolio de réalisations', 'Maîtrise des outils de production']),
        contactEmail: 'casting@production.ci',
        isPublished: true,
        associationId: apci.id,
      },
      {
        slug: 'casting-acteurs-film',
        title: 'Casting Acteurs - Long métrage',
        description: 'Casting pour 5 rôles principaux et 20 figurants pour un nouveau film.',
        type: JobType.CASTING,
        location: 'Abidjan',
        deadline: new Date('2024-06-30'),
        requirements: JSON.stringify(['Hommes et femmes 20-50 ans', 'Disponibilité 3 mois', 'Pas d\'expérience requise pour les figurants']),
        contactEmail: 'casting@film.ci',
        contactPhone: '+225 07 00 00 10',
        isPublished: true,
        associationId: aact.id,
      },
      {
        slug: 'appel-projet-documentaire',
        title: 'Appel à projets documentaires',
        description: 'Financement disponible pour 5 projets de documentaires sur les thématiques sociales.',
        type: JobType.APPEL_PROJET,
        location: 'National',
        salary: 'Budget jusqu\'à 20.000.000 FCFA',
        deadline: new Date('2024-08-15'),
        requirements: JSON.stringify(['Synopsis détaillé', 'Note d\'intention', 'Budget prévisionnel', 'CV du réalisateur']),
        contactEmail: 'fonds@ficav.ci',
        isPublished: true,
      },
      {
        slug: 'stage-montage',
        title: 'Stage Assistant Monteur',
        description: 'Stage de 6 mois en post-production dans un studio professionnel.',
        type: JobType.STAGE,
        location: 'Abidjan',
        salary: 'Indemnité de stage',
        deadline: new Date('2024-07-15'),
        requirements: JSON.stringify(['Formation en audiovisuel', 'Connaissance Premiere Pro', 'Moins de 30 ans']),
        contactEmail: 'rh@studio.ci',
        isPublished: true,
        associationId: atci.id,
      },
    ],
  });

  console.log('Created jobs');

  // Create News
  await prisma.news.createMany({
    data: [
      {
        slug: 'fespaco-2024-palmares',
        title: 'FESPACO 2024: Le cinéma ivoirien en force',
        excerpt: 'La délégation ivoirienne revient du FESPACO avec 5 prix prestigieux.',
        content: 'Le Festival Panafricain du Cinéma et de la Télévision de Ouagadougou (FESPACO) 2024 a été un véritable succès pour le cinéma ivoirien. La délégation conduite par la FICAV a remporté 5 prix dont l\'Étalon d\'or pour le film "Run" de Philippe Koffi. Cette consécration confirme la vitalité et le talent des professionnels du cinéma ivoirien.',
        image: '/images/news/fespaco-2024.jpg',
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-03-10'),
      },
      {
        slug: 'nouveau-financement',
        title: 'Nouveau fonds de financement pour le cinéma',
        excerpt: 'Le gouvernement ivoirien annonce un fonds de 2 milliards FCFA pour le cinéma.',
        content: 'Dans le cadre de la politique de promotion de la culture, le gouvernement ivoirien a annoncé la création d\'un fonds de soutien au cinéma de 2 milliards de FCFA. Ce fonds sera géré par un comité incluant la FICAV et permettra de financer une vingtaine de projets par an.',
        image: '/images/news/financement.jpg',
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-04-15'),
      },
      {
        slug: 'formation-netflix',
        title: 'Partenariat FICAV-Netflix pour la formation',
        excerpt: 'Netflix s\'engage à former 100 techniciens ivoiriens d\'ici 2025.',
        content: 'La FICAV a signé un partenariat stratégique avec Netflix pour le développement des compétences dans le secteur audiovisuel. Ce programme prévoit la formation de 100 techniciens ivoiriens aux métiers du streaming et de la production numérique.',
        image: '/images/news/netflix.jpg',
        isPublished: true,
        publishedAt: new Date('2024-05-01'),
      },
    ],
  });

  console.log('Created news');

  // Create Cotisations
  await prisma.cotisation.createMany({
    data: [
      {
        year: 2024,
        amount: 500000,
        dueDate: new Date('2024-03-31'),
        status: PaymentStatus.PAID,
        paidAt: new Date('2024-02-15'),
        paymentMethod: 'Orange Money',
        transactionId: 'OM-2024-001',
        associationId: arp.id,
      },
      {
        year: 2024,
        amount: 500000,
        dueDate: new Date('2024-03-31'),
        status: PaymentStatus.PAID,
        paidAt: new Date('2024-03-01'),
        paymentMethod: 'Wave',
        transactionId: 'WV-2024-002',
        associationId: apci.id,
      },
      {
        year: 2024,
        amount: 300000,
        dueDate: new Date('2024-03-31'),
        status: PaymentStatus.PENDING,
        associationId: aact.id,
      },
      {
        year: 2024,
        amount: 400000,
        dueDate: new Date('2024-03-31'),
        status: PaymentStatus.OVERDUE,
        associationId: atci.id,
      },
    ],
  });

  console.log('Created cotisations');

  // Create Statistics
  await prisma.statistics.create({
    data: {
      year: 2024,
      totalFilms: 85,
      totalTechnicians: 1250,
      totalAssociations: 12,
      totalProductions: 142,
      genreDistribution: JSON.stringify({
        'Drame': 35,
        'Comédie': 25,
        'Documentaire': 15,
        'Action': 10,
        'Animation': 5,
      }),
      regionalDistribution: JSON.stringify({
        'Abidjan': 75,
        'Yamoussoukro': 10,
        'Bouaké': 8,
        'San-Pédro': 5,
        'Autres': 2,
      }),
    },
  });

  console.log('Created statistics');

  // Create Documents
  await prisma.document.createMany({
    data: [
      {
        title: 'Statuts de la FICAV',
        description: 'Statuts officiels de la Fédération Ivoirienne du Cinéma et de l\'Audiovisuel.',
        category: 'statuts',
        fileUrl: '/documents/statuts-ficav.pdf',
        fileType: 'application/pdf',
      },
      {
        title: 'Règlement intérieur',
        description: 'Règlement intérieur de la FICAV.',
        category: 'reglements',
        fileUrl: '/documents/reglement-ficav.pdf',
        fileType: 'application/pdf',
      },
      {
        title: 'Convention collective du secteur audiovisuel',
        description: 'Convention collective régissant les relations de travail dans le secteur.',
        category: 'convention',
        fileUrl: '/documents/convention-collective.pdf',
        fileType: 'application/pdf',
      },
      {
        title: 'Rapport d\'activités 2023',
        description: 'Bilan annuel des activités de la FICAV.',
        category: 'rapport',
        fileUrl: '/documents/rapport-2023.pdf',
        fileType: 'application/pdf',
      },
    ],
  });

  console.log('Created documents');

  // Create Press Releases
  await prisma.pressRelease.createMany({
    data: [
      {
        slug: 'communique-fespaco-2024',
        title: 'Communiqué: Succès du cinéma ivoirien au FESPACO 2024',
        content: 'La FICAV félicite l\'ensemble des professionnels ivoiriens pour leurs performances exceptionnelles lors du FESPACO 2024.',
        type: 'communiqué',
        isPublished: true,
        publishedAt: new Date('2024-03-05'),
      },
      {
        slug: 'dossier-presse-ficav',
        title: 'Dossier de presse FICAV 2024',
        content: 'Présentation de la Fédération Ivoirienne du Cinéma et de l\'Audiovisuel, ses missions et ses réalisations.',
        type: 'dossier',
        attachmentUrl: '/documents/dossier-presse-2024.pdf',
        isPublished: true,
        publishedAt: new Date('2024-01-15'),
      },
    ],
  });

  console.log('Created press releases');

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
