import { NextResponse } from 'next/server';

// Types for map locations
export interface MapLocation {
  id: string;
  name: string;
  type: 'STUDIO' | 'PRODUCTION' | 'CINEMA' | 'ASSOCIATION' | 'LOCATION';
  address: string;
  city: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  website?: string;
  description: string;
  image?: string;
  relatedFilms?: string[];
  yearFounded?: number;
  capacity?: number;
}

// Sample locations data for the Ivorian cinema ecosystem
const sampleLocations: MapLocation[] = [
  // Studios
  {
    id: 'studio-225',
    name: 'Studio 225',
    type: 'STUDIO',
    address: 'Zone Industrielle, Boulevard de Marseille',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3599, lng: -4.0083 },
    phone: '+225 27 22 44 55 66',
    email: 'contact@studio225.ci',
    website: 'www.studio225.ci',
    description: 'Principal studio de tournage en Côte d\'Ivoire avec 3 plateaux équipés pour le cinéma et la télévision.',
    yearFounded: 2010,
    capacity: 200,
  },
  {
    id: 'abidja-films',
    name: 'Abidja Films Studio',
    type: 'STUDIO',
    address: 'Rue des Jardins, Cocody',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3499, lng: -3.9983 },
    phone: '+225 27 22 33 44 55',
    email: 'info@abidjafilms.ci',
    description: 'Studio moderne spécialisé dans les productions locales et internationales.',
    yearFounded: 2015,
    capacity: 150,
  },
  {
    id: 'africa-studio',
    name: 'Africa Cinema Studio',
    type: 'STUDIO',
    address: 'Boulevard Lagunaire, Treichville',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3399, lng: -4.0183 },
    phone: '+225 27 21 55 66 77',
    email: 'studio@africacinema.ci',
    website: 'www.africacinema.ci',
    description: 'Studio de pointe avec équipements dernière génération pour le cinéma numérique.',
    yearFounded: 2018,
    capacity: 180,
  },
  
  // Production Companies
  {
    id: 'bollywood-africa',
    name: 'Bollywood Africa Productions',
    type: 'PRODUCTION',
    address: 'Immeuble Le Pellicule, Plateau',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3699, lng: -4.0283 },
    phone: '+225 27 20 30 40 50',
    email: 'prod@bollywoodafrica.ci',
    website: 'www.bollywoodafrica.ci',
    description: 'Société de production leader avec plus de 50 films à son actif.',
    yearFounded: 2005,
  },
  {
    id: 'ivoire-productions',
    name: 'Ivoire Productions',
    type: 'PRODUCTION',
    address: 'Avenue Chardy, Marcory',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3299, lng: -4.0083 },
    phone: '+225 27 21 44 55 66',
    email: 'contact@ivoireprod.ci',
    description: 'Production de films documentaires et de fiction ivoiriens.',
    yearFounded: 2008,
  },
  {
    id: 'akwaba-films',
    name: 'Akwaba Films',
    type: 'PRODUCTION',
    address: 'Rue Commerciales, Koumassi',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3199, lng: -3.9883 },
    phone: '+225 27 21 33 44 55',
    email: 'info@akwabafilms.ci',
    website: 'www.akwabafilms.ci',
    description: 'Production de courts métrages et documentaires sur l\'Afrique.',
    yearFounded: 2012,
  },
  {
    id: 'sud-cinema',
    name: 'Sud Cinema Production',
    type: 'PRODUCTION',
    address: 'Avenue de la République, San Pedro',
    city: 'San Pédro',
    region: 'Bas-Sassandra',
    coordinates: { lat: 4.7684, lng: -6.6380 },
    phone: '+225 27 34 12 34 56',
    email: 'prod@sudcinema.ci',
    description: 'Production régionale axée sur les histoires du sud de la Côte d\'Ivoire.',
    yearFounded: 2016,
  },
  
  // Cinemas
  {
    id: 'canal-olympia-aby',
    name: 'CanalOlympia Abidjan',
    type: 'CINEMA',
    address: 'Centre Commercial PlaYce, Marcory',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3399, lng: -4.0283 },
    phone: '+225 27 21 50 60 70',
    email: 'abidjan@canalolympia.com',
    website: 'www.canalolympia.com',
    description: 'Complexe cinématographique moderne avec 8 salles et technologie 3D.',
    capacity: 1200,
  },
  {
    id: 'majestic',
    name: 'Cinéma Majestic',
    type: 'CINEMA',
    address: 'Boulevard de la République, Plateau',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3799, lng: -4.0383 },
    phone: '+225 27 20 25 35 45',
    email: 'contact@majestic-cinema.ci',
    description: 'Cinéma historique d\'Abidjan, symbole du cinéma ivoirien depuis 1975.',
    yearFounded: 1975,
    capacity: 450,
  },
  {
    id: 'ivoire-cine',
    name: 'Ivoire Cine',
    type: 'CINEMA',
    address: 'Centre Commercial Abidjan Mall, Cocody',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3540, lng: -3.9850 },
    phone: '+225 27 22 48 58 68',
    email: 'info@ivoirecine.ci',
    website: 'www.ivoirecine.ci',
    description: 'Nouvelle génération de cinéma avec projection laser 4K et son Dolby Atmos.',
    yearFounded: 2022,
    capacity: 600,
  },
  {
    id: 'starlight-yamoussoukro',
    name: 'Starlight Cinéma Yamoussoukro',
    type: 'CINEMA',
    address: 'Centre Commercial, Yamoussoukro',
    city: 'Yamoussoukro',
    region: 'Yamoussoukro',
    coordinates: { lat: 6.8276, lng: -5.2893 },
    phone: '+225 27 30 12 34 56',
    email: 'yamoussoukro@starlight.ci',
    description: 'Principal cinéma de la capitale politique avec 4 salles.',
    capacity: 350,
  },
  {
    id: 'cine-bouake',
    name: 'Cinéma de Bouaké',
    type: 'CINEMA',
    address: 'Avenue de l\'Indépendance, Bouaké',
    city: 'Bouaké',
    region: 'Gbêkê',
    coordinates: { lat: 7.6892, lng: -5.0309 },
    phone: '+225 27 31 23 45 67',
    email: 'contact@cine-bouake.ci',
    description: 'Cinéma régional servant la deuxième ville du pays.',
    yearFounded: 1985,
    capacity: 280,
  },
  
  // Associations
  {
    id: 'ficav-hq',
    name: 'FICAV - Siège',
    type: 'ASSOCIATION',
    address: 'Immeuble du Cinéma, Plateau',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3649, lng: -4.0150 },
    phone: '+225 27 20 30 40 40',
    email: 'contact@ficav.ci',
    website: 'www.ficav.ci',
    description: 'Fédération Ivoirienne du Cinéma et de l\'Audiovisuel - Organisme faîtier du cinéma ivoirien.',
    yearFounded: 1989,
  },
  {
    id: 'aprocib',
    name: 'APROCIB',
    type: 'ASSOCIATION',
    address: 'Rue des Artisans, Treichville',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3390, lng: -4.0210 },
    phone: '+225 27 21 30 40 50',
    email: 'aprocib@ficav.ci',
    description: 'Association des Producteurs de Cinéma de Côte d\'Ivoire.',
    yearFounded: 1992,
  },
  {
    id: 'arpa',
    name: 'ARPA',
    type: 'ASSOCIATION',
    address: 'Avenue de la Paix, Cocody',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3500, lng: -3.9950 },
    phone: '+225 27 22 35 45 55',
    email: 'arpa@ficav.ci',
    description: 'Association des Réalisateurs et Producteurs Audiovisuels.',
    yearFounded: 1995,
  },
  {
    id: 'uciaav',
    name: 'UCIAV',
    type: 'ASSOCIATION',
    address: 'Zone 4, Marcory',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3250, lng: -4.0050 },
    phone: '+225 27 21 40 50 60',
    email: 'uciav@ficav.ci',
    description: 'Union des Cinéastes et Techniciens de l\'Audiovisuel.',
    yearFounded: 1998,
  },
  {
    id: 'apiac-regional',
    name: 'APIAC Regional',
    type: 'ASSOCIATION',
    address: 'Centre Culturel, San Pédro',
    city: 'San Pédro',
    region: 'Bas-Sassandra',
    coordinates: { lat: 4.7700, lng: -6.6350 },
    phone: '+225 27 34 15 25 35',
    email: 'apiac@ficav.ci',
    description: 'Association des Professionnels de l\'Image et Audiovisuel - Antenne Régionale.',
    yearFounded: 2010,
  },
  
  // Filming Locations
  {
    id: 'basilica-yamoussoukro',
    name: 'Basilique Notre-Dame de la Paix',
    type: 'LOCATION',
    address: 'Yamoussoukro',
    city: 'Yamoussoukro',
    region: 'Yamoussoukro',
    coordinates: { lat: 6.8200, lng: -5.2700 },
    description: 'Lieu de tournage emblématique - Plus grande basilique du monde.',
    relatedFilms: ['Le Visage de la Paix', 'Yamoussoukro, Cité Sacrée'],
  },
  {
    id: 'grand-bassam',
    name: 'Grand-Bassam',
    type: 'LOCATION',
    address: 'Grand-Bassam',
    city: 'Grand-Bassam',
    region: 'Sud-Comoé',
    coordinates: { lat: 5.2200, lng: -3.7300 },
    description: 'Ville coloniale classée UNESCO - Décors historiques et plages.',
    relatedFilms: ['Le Nouveau', 'Bronx-Barbès', 'Caramel'],
  },
  {
    id: 'abidjan-plateau',
    name: 'Le Plateau - Abidjan',
    type: 'LOCATION',
    address: 'Plateau',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3800, lng: -4.0300 },
    description: 'Quartier d\'affaires avec gratte-ciels - Ambiance urbaine moderne.',
    relatedFilms: ['Run', 'Action Force', 'Philo'],
  },
  {
    id: 'adamaou-cascade',
    name: 'Cascade de Man',
    type: 'LOCATION',
    address: 'Man, Région des Montagnes',
    city: 'Man',
    region: 'Montagnes',
    coordinates: { lat: 7.5400, lng: -7.5500 },
    description: 'Paysages naturels spectaculaires - Cascades et montagnes.',
    relatedFilms: ['Les Enfants du Soleil', 'Kalakuta'],
  },
  {
    id: 'como-national-park',
    name: 'Parc National de Comoé',
    type: 'LOCATION',
    address: 'Parc National de Comoé',
    city: 'Bondoukou',
    region: 'Zanzan',
    coordinates: { lat: 8.5000, lng: -3.8000 },
    description: 'Réserve naturelle - Safari et paysages sauvages.',
    relatedFilms: ['Documentaires nature', 'Africa Wild'],
  },
  {
    id: 'treichville-market',
    name: 'Marché de Treichville',
    type: 'LOCATION',
    address: 'Treichville',
    city: 'Abidjan',
    region: 'Abidjan',
    coordinates: { lat: 5.3350, lng: -4.0250 },
    description: 'Marché animé typiquement africain - Couleurs et ambiance locale.',
    relatedFilms: ['Bronx-Barbès', 'Aya de Yopougon'],
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const region = searchParams.get('region');

  let filteredLocations = [...sampleLocations];

  // Filter by type
  if (type && type !== 'all') {
    filteredLocations = filteredLocations.filter(
      (loc) => loc.type === type.toUpperCase()
    );
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredLocations = filteredLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchLower) ||
        loc.city.toLowerCase().includes(searchLower) ||
        loc.description.toLowerCase().includes(searchLower)
    );
  }

  // Filter by region
  if (region && region !== 'all') {
    filteredLocations = filteredLocations.filter(
      (loc) => loc.region.toLowerCase() === region.toLowerCase()
    );
  }

  return NextResponse.json({
    locations: filteredLocations,
    total: filteredLocations.length,
    regions: [...new Set(sampleLocations.map((loc) => loc.region))].sort(),
  });
}
