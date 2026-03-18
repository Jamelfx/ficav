"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Building2,
  Camera,
  Users,
  MapPin,
  X,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users2,
  Clapperboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MapLocation } from "@/app/api/map/route";

interface CinemaMapProps {
  locations: MapLocation[];
  selectedTypes: string[];
  selectedLocation: MapLocation | null;
  onSelectLocation: (location: MapLocation | null) => void;
}

// Type configurations with colors and icons
const typeConfig = {
  STUDIO: {
    color: "#3B82F6", // blue
    bgColor: "bg-blue-500",
    borderColor: "border-blue-500",
    textColor: "text-blue-400",
    label: "Studios",
    icon: Clapperboard,
  },
  PRODUCTION: {
    color: "#F97316", // orange
    bgColor: "bg-orange-500",
    borderColor: "border-orange-500",
    textColor: "text-orange-400",
    label: "Productions",
    icon: Film,
  },
  CINEMA: {
    color: "#22C55E", // green
    bgColor: "bg-green-500",
    borderColor: "border-green-500",
    textColor: "text-green-400",
    label: "Cinémas",
    icon: Building2,
  },
  ASSOCIATION: {
    color: "#A855F7", // purple
    bgColor: "bg-purple-500",
    borderColor: "border-purple-500",
    textColor: "text-purple-400",
    label: "Associations",
    icon: Users,
  },
  LOCATION: {
    color: "#EAB308", // yellow
    bgColor: "bg-yellow-500",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-400",
    label: "Lieux de tournage",
    icon: MapPin,
  },
};

// Map boundaries for Côte d'Ivoire (approximate)
// Lat: 4.3° to 10.7° N
// Lng: -8.6° to -2.5° W
const MAP_BOUNDS = {
  minLat: 4.0,
  maxLat: 11.0,
  minLng: -8.7,
  maxLng: -2.3,
};

// SVG viewBox dimensions
const SVG_WIDTH = 800;
const SVG_HEIGHT = 700;

// Convert coordinates to SVG position
const coordsToSvg = (lat: number, lng: number) => {
  const x =
    ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
    SVG_WIDTH;
  const y =
    ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
    SVG_HEIGHT;
  return { x, y };
};

// Simplified Côte d'Ivoire path (SVG path)
const IVORY_COAST_PATH = `
  M 100,20
  L 200,10
  L 350,15
  L 480,30
  L 550,80
  L 620,120
  L 700,180
  L 750,250
  L 780,350
  L 770,450
  L 720,520
  L 650,570
  L 550,600
  L 450,610
  L 350,620
  L 250,630
  L 150,640
  L 80,600
  L 40,520
  L 20,420
  L 30,320
  L 50,220
  L 70,120
  Z
`;

export function CinemaMap({
  locations,
  selectedTypes,
  selectedLocation,
  onSelectLocation,
}: CinemaMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(
    null
  );

  // Filter locations based on selected types
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => selectedTypes.includes(loc.type));
  }, [locations, selectedTypes]);

  // Group locations by type for legend
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLocations.forEach((loc) => {
      counts[loc.type] = (counts[loc.type] || 0) + 1;
    });
    return counts;
  }, [filteredLocations]);

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* SVG Map */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-full"
        style={{ minHeight: "500px" }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.16 0.012 260)" />
            <stop offset="50%" stopColor="oklch(0.14 0.012 260)" />
            <stop offset="100%" stopColor="oklch(0.12 0.01 260)" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Country shape */}
        <g>
          {/* Outer glow */}
          <path
            d={IVORY_COAST_PATH}
            fill="none"
            stroke="oklch(0.70 0.18 45 / 0.3)"
            strokeWidth="8"
            filter="url(#glow)"
          />
          {/* Main country shape */}
          <path
            d={IVORY_COAST_PATH}
            fill="url(#mapGradient)"
            stroke="oklch(0.30 0.02 260)"
            strokeWidth="2"
            className="cursor-pointer"
          />
          {/* Country name */}
          <text
            x={SVG_WIDTH / 2}
            y={SVG_HEIGHT / 2}
            textAnchor="middle"
            fill="oklch(0.40 0.02 260)"
            fontSize="48"
            fontWeight="bold"
            opacity="0.3"
          >
            CÔTE D&apos;IVOIRE
          </text>
        </g>

        {/* Location markers */}
        {filteredLocations.map((location) => {
          const { x, y } = coordsToSvg(
            location.coordinates.lat,
            location.coordinates.lng
          );
          const config = typeConfig[location.type];
          const isSelected = selectedLocation?.id === location.id;
          const isHovered = hoveredLocation?.id === location.id;

          return (
            <g
              key={location.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer"
              onClick={() => onSelectLocation(location)}
              onMouseEnter={() => setHoveredLocation(location)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              {/* Marker glow effect */}
              <circle
                r={isSelected || isHovered ? 25 : 18}
                fill={config.color}
                opacity={isSelected || isHovered ? 0.3 : 0.15}
                className="transition-all duration-300"
              />
              {/* Main marker */}
              <circle
                r={isSelected ? 14 : isHovered ? 12 : 10}
                fill={config.color}
                stroke="white"
                strokeWidth={isSelected ? 3 : 2}
                filter="url(#shadow)"
                className="transition-all duration-200"
              />
              {/* Inner icon indicator */}
              <circle
                r={isSelected ? 6 : 4}
                fill="white"
                className="pointer-events-none"
              />
              {/* Label on hover/select */}
              {(isSelected || isHovered) && (
                <g transform="translate(0, -25)">
                  <rect
                    x={-60}
                    y={-12}
                    width={120}
                    height={24}
                    rx={4}
                    fill="oklch(0.14 0.012 260 / 0.95)"
                    stroke={config.color}
                    strokeWidth="1"
                  />
                  <text
                    x={0}
                    y={5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {location.name.substring(0, 15)}
                    {location.name.length > 15 ? "..." : ""}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Region labels */}
        <g fill="oklch(0.50 0.02 260)" fontSize="12" fontWeight="500">
          <text x={550} y={200} opacity="0.6">
            ABIDJAN
          </text>
          <text x={420} y={100} opacity="0.5">
            YAMOUSSOUKRO
          </text>
          <text x={450} y={350} opacity="0.5">
            BOUAKÉ
          </text>
          <text x={200} y={450} opacity="0.5">
            SAN PÉDRO
          </text>
          <text x={650} y={150} opacity="0.4">
            MAN
          </text>
        </g>
      </svg>

      {/* Hover popup */}
      <AnimatePresence>
        {hoveredLocation && !selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 glass-card rounded-xl p-4 z-20"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  typeConfig[hoveredLocation.type].bgColor
                }`}
              >
                {(() => {
                  const Icon = typeConfig[hoveredLocation.type].icon;
                  return <Icon className="w-5 h-5 text-white" />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {hoveredLocation.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hoveredLocation.city}, {hoveredLocation.region}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-2 ${typeConfig[hoveredLocation.type].borderColor} ${
                    typeConfig[hoveredLocation.type].textColor
                  }`}
                >
                  {typeConfig[hoveredLocation.type].label}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {hoveredLocation.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Location Detail Sidebar Component
interface LocationSidebarProps {
  location: MapLocation | null;
  onClose: () => void;
}

export function LocationSidebar({ location, onClose }: LocationSidebarProps) {
  if (!location) return null;

  const config = typeConfig[location.type];

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="absolute inset-y-0 right-0 w-full md:w-96 glass-card border-l border-border/50 z-30 flex flex-col"
    >
      {/* Header */}
      <div className="relative h-40 bg-gradient-to-b from-primary/20 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/80 hover:text-foreground hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="absolute bottom-4 left-4 right-4">
          <Badge
            className={`${config.bgColor} text-white border-0 mb-2`}
          >
            {config.label}
          </Badge>
          <h2 className="text-xl font-bold text-foreground">
            {location.name}
          </h2>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-foreground">{location.address}</p>
                <p className="text-sm text-muted-foreground">
                  {location.city}, {location.region}
                </p>
              </div>
            </div>

            {location.yearFounded && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-foreground">
                  Fondé en {location.yearFounded}
                </p>
              </div>
            )}

            {location.capacity && (
              <div className="flex items-center gap-3">
                <Users2 className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-foreground">
                  Capacité: {location.capacity.toLocaleString()} places
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Description
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {location.description}
            </p>
          </div>

          {/* Contact Info */}
          {(location.phone || location.email || location.website) && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Contact
              </h3>
              <div className="space-y-2">
                {location.phone && (
                  <a
                    href={`tel:${location.phone}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {location.phone}
                  </a>
                )}
                {location.email && (
                  <a
                    href={`mailto:${location.email}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {location.email}
                  </a>
                )}
                {location.website && (
                  <a
                    href={`https://${location.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {location.website}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Related Films */}
          {location.relatedFilms && location.relatedFilms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Films associés
              </h3>
              <div className="flex flex-wrap gap-2">
                {location.relatedFilms.map((film, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-primary/30 text-primary"
                  >
                    {film}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border/50">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Voir le profil complet
        </Button>
      </div>
    </motion.div>
  );
}

// Type Legend Component
interface TypeLegendProps {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  counts: Record<string, number>;
}

export function TypeLegend({
  selectedTypes,
  onToggleType,
  counts,
}: TypeLegendProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(typeConfig).map(([type, config]) => {
        const isSelected = selectedTypes.includes(type);
        const count = counts[type] || 0;
        const Icon = config.icon;

        return (
          <button
            key={type}
            onClick={() => onToggleType(type)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? `${config.bgColor} text-white`
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
            <span
              className={`text-xs ${
                isSelected ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { typeConfig };
