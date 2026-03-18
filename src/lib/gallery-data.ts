import { StaticImageData } from "next/image";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

export interface GallerySeries {
  id: string;
  title: string;
  titleCn: string;
  description: string;
  images: GalleryImage[];
}

// Horizon City Series
const horizonCityImages: GalleryImage[] = [
  {
    id: "hc-1",
    src: "/images/gallery/horizon-city/hc-1.png",
    alt: "Modern cityscape at golden hour with dramatic orange and purple sky",
    title: "Golden Hour Metropolis",
    description: "Where the city meets the sky in a dance of light and steel.",
    width: 1344,
    height: 768,
  },
  {
    id: "hc-2",
    src: "/images/gallery/horizon-city/hc-2.png",
    alt: "Glass skyscrapers reflecting dramatic clouds in blue sky",
    title: "Glass Reflections",
    description: "Clouds captured within the geometry of human ambition.",
    width: 1344,
    height: 768,
  },
  {
    id: "hc-3",
    src: "/images/gallery/horizon-city/hc-3.png",
    alt: "Urban skyline at dusk with city lights glowing",
    title: "Dusk Awakening",
    description: "The moment the city begins to breathe its evening light.",
    width: 1344,
    height: 768,
  },
  {
    id: "hc-4",
    src: "/images/gallery/horizon-city/hc-4.png",
    alt: "Modern architecture detail with geometric patterns",
    title: "Geometric Poetry",
    description: "Abstract patterns hidden in plain sight.",
    width: 1344,
    height: 768,
  },
  {
    id: "hc-5",
    src: "/images/gallery/horizon-city/hc-5.png",
    alt: "City lights at night reflecting on wet streets",
    title: "Neon Rain",
    description: "When rain becomes a mirror for city lights.",
    width: 1344,
    height: 768,
  },
  {
    id: "hc-6",
    src: "/images/gallery/horizon-city/hc-6.png",
    alt: "Minimalist urban geometry with concrete and glass",
    title: "Urban Silence",
    description: "Finding peace in architectural minimalism.",
    width: 1344,
    height: 768,
  },
];

// Soft Wind Series
const softWindImages: GalleryImage[] = [
  {
    id: "sw-1",
    src: "/images/gallery/soft-wind/sw-1.png",
    alt: "Gentle breeze through golden wheat field at sunset",
    title: "Golden Whisper",
    description: "The wind speaks in golden tones across the fields.",
    width: 1344,
    height: 768,
  },
  {
    id: "sw-2",
    src: "/images/gallery/soft-wind/sw-2.png",
    alt: "Soft morning light streaming through white curtains",
    title: "Morning Dance",
    description: "Light and fabric in a gentle embrace.",
    width: 1344,
    height: 768,
  },
  {
    id: "sw-3",
    src: "/images/gallery/soft-wind/sw-3.png",
    alt: "White fabric blowing gently against blue sky",
    title: "Billowing Dreams",
    description: "Where wind becomes visible through fabric.",
    width: 1344,
    height: 768,
  },
  {
    id: "sw-4",
    src: "/images/gallery/soft-wind/sw-4.png",
    alt: "Peaceful meadow with wildflowers in golden light",
    title: "Meadow Song",
    description: "Wildflowers dancing to nature's rhythm.",
    width: 1344,
    height: 768,
  },
  {
    id: "sw-5",
    src: "/images/gallery/soft-wind/sw-5.png",
    alt: "Single delicate white flower in tall grass",
    title: "Solitary Bloom",
    description: "Finding beauty in delicate simplicity.",
    width: 1344,
    height: 768,
  },
  {
    id: "sw-6",
    src: "/images/gallery/soft-wind/sw-6.png",
    alt: "Soft white clouds drifting across pale blue sky",
    title: "Drifting Thoughts",
    description: "Clouds as metaphors for passing moments.",
    width: 1344,
    height: 768,
  },
];

// Quiet Lake Series
const quietLakeImages: GalleryImage[] = [
  {
    id: "ql-1",
    src: "/images/gallery/quiet-lake/ql-1.png",
    alt: "Calm lake at sunrise with mist rising",
    title: "First Light",
    description: "When water becomes a canvas for dawn.",
    width: 1344,
    height: 768,
  },
  {
    id: "ql-2",
    src: "/images/gallery/quiet-lake/ql-2.png",
    alt: "Mirror-like water reflection of mountains",
    title: "Perfect Reflection",
    description: "Where sky and earth become indistinguishable.",
    width: 1344,
    height: 768,
  },
  {
    id: "ql-3",
    src: "/images/gallery/quiet-lake/ql-3.png",
    alt: "Misty morning on calm lake with tree silhouettes",
    title: "Misty Meditation",
    description: "Silence wrapped in morning fog.",
    width: 1344,
    height: 768,
  },
  {
    id: "ql-4",
    src: "/images/gallery/quiet-lake/ql-4.png",
    alt: "Still water with floating water lilies",
    title: "Floating Gardens",
    description: "Nature's meditation on stillness.",
    width: 1344,
    height: 768,
  },
  {
    id: "ql-5",
    src: "/images/gallery/quiet-lake/ql-5.png",
    alt: "Lake surrounded by misty mountains",
    title: "Mountain Embrace",
    description: "Where water meets ancient peaks.",
    width: 1344,
    height: 768,
  },
  {
    id: "ql-6",
    src: "/images/gallery/quiet-lake/ql-6.png",
    alt: "Wooden dock extending into lake at sunset",
    title: "Journey's End",
    description: "A path to serenity at golden hour.",
    width: 1344,
    height: 768,
  },
];

export const gallerySeries: GallerySeries[] = [
  {
    id: "horizon-city",
    title: "Horizon City",
    titleCn: "地平线之城",
    description: "Exploring the intersection of urban architecture and natural light. A meditation on the geometry of human ambition against the canvas of the sky.",
    images: horizonCityImages,
  },
  {
    id: "soft-wind",
    title: "Soft Wind",
    titleCn: "柔软的风",
    description: "Capturing the invisible through its effects. Wind as sculptor, fabric and grass as its medium. Moments of gentle movement frozen in time.",
    images: softWindImages,
  },
  {
    id: "quiet-lake",
    title: "Quiet Lake",
    titleCn: "静湖",
    description: "Water as mirror, water as canvas. Studies in stillness and reflection. The profound peace found where water meets sky.",
    images: quietLakeImages,
  },
];
