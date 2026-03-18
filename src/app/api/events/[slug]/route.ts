import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const event = await db.event.findUnique({
      where: { slug },
      include: {
        association: {
          select: { name: true, slug: true, logo: true },
        },
      },
    });

    if (event) {
      return NextResponse.json(event);
    }

    // Return sample data if not found in database
    const sampleEvent = getSampleEventBySlug(slug);
    if (sampleEvent) {
      return NextResponse.json(sampleEvent);
    }

    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching event:', error);
    const { slug } = await params;
    const sampleEvent = getSampleEventBySlug(slug);
    if (sampleEvent) {
      return NextResponse.json(sampleEvent);
    }
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
}

function getSampleEventBySlug(slug: string) {
  const now = new Date();
  
  const events: Record<string, any> = {
    'festival-cinema-abidjan-2025': {
      id: '1',
      slug: 'festival-cinema-abidjan-2025',
      title: 'Festival du Cinéma d\'Abidjan 2025',
      description: `La 16ème édition du plus grand festival de cinéma de Côte d'Ivoire vous attend pour une semaine exceptionnelle de célébration du cinéma africain.

**Programme prévisionnel :**

🎬 **Compétition Officielle**
- Longs métrages de fiction
- Documentaires
- Courts métrages

🎭 **Sections Parallèles**
- Rétrospective du cinéma ivoirien
- Focus sur le cinéma de la diaspora
- Hommage aux pionniers

📚 **Industry Days**
- Tables rondes professionnelles
- Ateliers de formation
- Rencontres B2B
- Pitch de projets

🎉 **Événements Spéciaux**
- Cérémonie d'ouverture
- Soirée des lauréats
- Projection en plein air

**Les prix :**
- Étalon d'Or du Meilleur Film
- Prix du Meilleur Réalisateur
- Prix d'Interprétation Masculine et Féminine
- Prix du Meilleur Scénario
- Prix du Public`,
      type: 'FESTIVAL',
      venue: 'Palais de la Culture',
      address: 'Rue des Jardins, Treichville',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/festival.jpg',
      maxAttendees: 2000,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      association: { 
        name: 'FICAV', 
        slug: 'ficav',
        logo: '/images/ficav-logo.png'
      },
    },
    'assemblee-generale-ficav': {
      id: '2',
      slug: 'assemblee-generale-ficav',
      title: 'Assemblée Générale Annuelle FICAV',
      description: `Tous les membres de la Fédération sont conviés à l'Assemblée Générale Annuelle, moment fort de la vie de notre organisation.

**Ordre du jour :**

1. **Rapport Moral**
   - Bilan des activités de l'année écoulée
   - Actions menées et résultats obtenus

2. **Rapport Financier**
   - Présentation des comptes
   - Bilan financier détaillé

3. **Rapport d'Activités**
   - Projets réalisés
   - Événements organisés
   - Formations dispensées

4. **Élections**
   - Renouvellement du Bureau Fédéral
   - Désignation des commissions

5. **Perspectives 2025-2026**
   - Plan d'actions stratégiques
   - Calendrier prévisionnel
   - Budget prévisionnel

**Documents à télécharger :**
- Rapport moral 2024
- Rapport financier 2024
- Liste des candidats

*L'assemblée sera suivie d'un cocktail de fraternité.*`,
      type: 'ASSEMBLY',
      venue: 'Siège FICAV',
      address: 'Plateau, Immeuble le Centre, 5ème étage',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/ag.jpg',
      maxAttendees: 150,
      videoUrl: null,
      association: { 
        name: 'FICAV', 
        slug: 'ficav',
        logo: '/images/ficav-logo.png'
      },
    },
    'masterclass-realisation-regina': {
      id: '3',
      slug: 'masterclass-realisation-regina',
      title: 'Masterclass Réalisation avec Régina Saffari',
      description: `Une opportunité unique d'apprendre aux côtés de Régina Saffari, réalisatrice primée dont les œuvres ont été sélectionnées dans les plus grands festivals internationaux.

**Au programme :**

📽️ **Matin (9h-12h) : Théorie**
- Le langage cinématographique
- La mise en scène et le découpage
- Le travail avec les comédiens
- La direction photo

🎬 **Après-midi (14h-17h) : Pratique**
- Exercices de mise en scène
- Tournage d'une séquence
- Analyse collective des rushes
- Montage et finalisation

**Profil de l'intervenante :**
Régina Saffari est une réalisatrice d'origine camerounaise. Son dernier long métrage, "Les Silences du Passé", a remporté l'Étalon d'Argent au FESPACO 2023.

**Prérequis :**
- Avoir réalisé au moins un court métrage
- Maîtriser les bases du langage cinématographique

*Places limitées à 50 participants. Inscription obligatoire.*`,
      type: 'TRAINING',
      venue: 'Institut Français',
      address: 'Rue des Jardins, Cocody',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/masterclass.jpg',
      maxAttendees: 50,
      videoUrl: null,
      association: { 
        name: 'ARPA', 
        slug: 'arpa',
        logo: null
      },
    },
    'projection-run-avant-premiere': {
      id: '4',
      slug: 'projection-run-avant-premiere',
      title: 'Avant-première "Run"',
      description: `Soyez parmi les premiers à découvrir "Run", le nouveau film qui fait sensation sur la scène internationale.

**Le Film :**
Run est un thriller haletant qui suit Kouassi, un jeune livreur à moto d'Abidjan, qui se retrouve involontairement mêlé à une affaire bien plus grande que lui. Entre courses poursuites échevelées et révélations bouleversantes, il découvrira que le plus dur n'est pas de fuir, mais de savoir quoi faire quand on ne peut plus courir.

**Programme :**
- 18h30 : Accueil des invités
- 19h00 : Introduction par le réalisateur
- 19h15 : Projection du film (110 min)
- 21h15 : Discussion avec l'équipe
- 22h00 : Cocktail de clôture

**L'équipe présente :**
- Philip Lacôte (Réalisateur)
- Jean-Baptiste Anoumou (Acteur principal)
- Marie-Louise Asseu (Actrice)

*Gratuit sur inscription préalable.*`,
      type: 'PROJECTION',
      venue: 'Cinéma Majestic',
      address: 'Boulevard de Marseille, Marcory',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/projection.jpg',
      maxAttendees: 300,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      association: { 
        name: 'ARPA', 
        slug: 'arpa',
        logo: null
      },
    },
    'conference-etat-cinema-ivoirien': {
      id: '5',
      slug: 'conference-etat-cinema-ivoirien',
      title: 'Conférence : L\'état du cinéma ivoirien',
      description: `Une table ronde incontournable pour faire le point sur l'industrie cinématographique ivoirienne et ses perspectives d'avenir.

**Intervenants :**

🎤 **Dr. Kofi Konan** - Président de la FICAV
"Le cinéma ivoirien : d'hier à demain"

🎤 **Marlène Koffi** - Réalisatrice et Productrice
"Les défis de la production indépendante"

🎤 **Ibrahim Ouattara** - Distributeur
"La distribution en Afrique : nouveaux modèles"

🎤 **Sidiki Bakaba** - Cinéaste
"La formation, clé de l'excellence"

🎤 **Représentant du Ministère de la Culture**
"Politiques publiques et soutien au cinéma"

**Modérateur :**
Fatou Sylla - Journaliste culturelle

**Thématiques abordées :**
- Bilan de la production 2024
- Financement et investissements
- Distribution et exploitation
- Formation et emplois
- Co-productions internationales
- Numérique et nouvelles plateformes

*Entrée libre et gratuite.*`,
      type: 'CONFERENCE',
      venue: 'Université Félix Houphouët-Boigny',
      address: 'Campus de Cocody, Amphithéâtre 500 places',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/conference.jpg',
      maxAttendees: 200,
      videoUrl: null,
      association: { 
        name: 'ARPACI', 
        slug: 'arpaci',
        logo: null
      },
    },
    'atelier-scenario-debutants': {
      id: '6',
      slug: 'atelier-scenario-debutants',
      title: 'Atelier d\'Écriture Scénaristique pour Débutants',
      description: `Un atelier intensif de 3 jours pour maîtriser les fondamentaux de l'écriture scénaristique et développer votre premier projet de film.

**Jour 1 : Les Fondamentaux**
- Structure narrative classique
- Les personnages et leurs arcs
- Le conflit dramatique
- Exercices pratiques

**Jour 2 : Développement**
- Écriture de la séquence
- Le dialogue au cinéma
- Rythme et tension
- Travail en groupe

**Jour 3 : Finalisation**
- Réécriture et polish
- Formatage professionnel
- Présentation des projets
- Feedback personnalisé

**Encadrement :**
- Valérie Oka - Scénariste (Prix du meilleur scénario FESPACO 2022)
- Jean-Louis Kouadio - Consultant en écriture

**Matériel requis :**
- Ordinateur portable
- Logiciel de traitement de texte
- Carnet de notes

*Certificat de participation délivré à l'issue de l'atelier.*`,
      type: 'WORKSHOP',
      venue: 'Maison de la Culture',
      address: 'Plateau, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/workshop.jpg',
      maxAttendees: 25,
      videoUrl: null,
      association: { 
        name: 'SACI', 
        slug: 'saci',
        logo: null
      },
    },
    'festival-court-metrage-yamoussoukro': {
      id: '7',
      slug: 'festival-court-metrage-yamoussoukro',
      title: 'Festival du Court Métrage de Yamoussoukro',
      description: `Le rendez-vous annuel des créateurs de courts métrages africains. Six jours de projections, de rencontres et de formation dans la capitale politique.

**Compétition Internationale :**
- Courts métrages de fiction
- Courts métrages documentaires
- Films d'animation
- Vidéos musicales

**Hors Compétition :**
- Rétrospective du court métrage ivoirien
- Section étudiante
- Programmes spéciaux jeunesse

**Activités Parallèles :**
- Ateliers de formation
- Masterclasses
- Rencontres professionnelles
- Pitch de projets

**Prix :**
- Grand Prix du Festival
- Prix de la Meilleure Réalisation
- Prix d'Interprétation
- Prix du Scénario
- Prix du Public

*Hébergement possible pour les participants venant de l'extérieur.*`,
      type: 'FESTIVAL',
      venue: 'Centre Culturel Municipal',
      address: 'Quartier Administratif',
      city: 'Yamoussoukro',
      startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/festival-court.jpg',
      maxAttendees: 800,
      videoUrl: null,
      association: { 
        name: 'FICAV', 
        slug: 'ficav',
        logo: '/images/ficav-logo.png'
      },
    },
    'formation-technique-son': {
      id: '8',
      slug: 'formation-technique-son',
      title: 'Formation Technique : Le Son au Cinéma',
      description: `Une formation complète sur les techniques de prise de son et de mixage pour le cinéma, dispensée par des professionnels de l'audiovisuel.

**Contenu de la formation :**

🔉 **Module 1 : Acoustique et Théorie**
- Les principes physiques du son
- L'acoustique des lieux
- Le son au cinéma vs autres médias

🎤 **Module 2 : Prise de Son**
- Les microphones et leurs usages
- Techniques d'enregistrement
- Gestion des ambiances

🎛️ **Module 3 : Post-production**
- Nettoyage et restauration
- Mixage et mastering
- Formats de sortie

**Matériel utilisé :**
- Enregistreurs Zoom et Sound Devices
- Micros Sennheiser et Rode
- Stations Pro Tools

*Attestation de formation professionnelle délivrée.*`,
      type: 'TRAINING',
      venue: 'Studio National',
      address: 'Treichville, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/events/formation.jpg',
      maxAttendees: 20,
      videoUrl: null,
      association: { 
        name: 'ATIC', 
        slug: 'atic',
        logo: null
      },
    },
    'projection-debat-kalakuta': {
      id: '9',
      slug: 'projection-debat-kalakuta',
      title: 'Projection-Débat : Kalakuta',
      description: `Une soirée spéciale autour du documentaire "Kalakuta", suivi d'un débat avec le réalisateur Rampa Yé.

**Le Film :**
"Kalakuta" est un voyage musical au cœur de la République de Kalakuta, l'univers mythique créé par Fela Kuti. À travers des images d'archives exceptionnelles et des témoignages de musiciens contemporains, le film explore l'héritage de l'Afrobeat et son impact sur plusieurs générations d'artistes africains.

**Programme :**
- 18h00 : Accueil
- 18h30 : Mot d'introduction
- 18h45 : Projection (120 min)
- 20h45 : Pause
- 21h00 : Débat avec Rampa Yé
- 22h00 : Fin de la soirée

**Invité :**
Rampa Yé - Réalisateur et anthropologue

**Modératrice :**
Aminata Diallo - Critique musicale

*Entrée libre.*`,
      type: 'PROJECTION',
      venue: 'Institut Goethe',
      address: 'Cocody, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/projection-debat.jpg',
      maxAttendees: 100,
      videoUrl: null,
      association: { 
        name: 'ARPA', 
        slug: 'arpa',
        logo: null
      },
    },
    'atelier-casting-professionnel': {
      id: '10',
      slug: 'atelier-casting-professionnel',
      title: 'Atelier Casting : Comment réussir son audition',
      description: `Un atelier intensif pour acteurs souhaitant perfectionner leur technique d'audition et maximiser leurs chances de décrocher des rôles.

**Programme :**

🎭 **Partie Théorique**
- Le processus de casting expliqué
- Ce que recherchent les directeurs
- Préparer son auditions

🎬 **Partie Pratique**
- Exercices de jeu face caméra
- Travail sur le texte
- Improvisations

📋 **Simulations**
- Castings réalistes
- Feedback immédiat
- Conseils personnalisés

**Intervenants :**
- Claire Mutte - Directrice de casting
- Serge Kanyou - Acteur et coach
- Fatou Sylla - Comédienne

**À apporter :**
- CV et book (si disponible)
- Tenue neutre pour le jeu

*Attestation de participation.*`,
      type: 'WORKSHOP',
      venue: 'Studio 225',
      address: 'Marcory, Abidjan',
      city: 'Abidjan',
      startDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      image: '/images/events/casting.jpg',
      maxAttendees: 30,
      videoUrl: null,
      association: { 
        name: 'GAM', 
        slug: 'gam',
        logo: null
      },
    },
  };

  return events[slug] || null;
}
