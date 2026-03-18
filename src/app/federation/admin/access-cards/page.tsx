"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  IdCard,
  QrCode,
  Printer,
  CheckCircle2,
  Plus,
  Eye,
  Calendar,
  MapPin,
  RefreshCw,
  Trash2,
  Edit,
  Clock3,
  Save,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

// Types
type FederationEvent = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  venue: string | null;
  address: string | null;
  city: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: {
    accessCards: number;
    attendances: number;
  };
};

type AccessCard = {
  id: string;
  cardId: string;
  eventId: string;
  associationId: string | null;
  associationName: string;
  associationShortName: string;
  representativeFirstName: string | null;
  representativeLastName: string | null;
  representativeFunction: string | null;
  cardNumber: number;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  isActivated: boolean;
  isPrinted: boolean;
  createdAt: string;
  event?: FederationEvent;
  attendance?: EventAttendance | null;
};

type EventAttendance = {
  id: string;
  eventId: string;
  cardId: string;
  scannedAt: string;
  scannedBy: string | null;
  sentToSecretary: boolean;
  sentAt: string | null;
  card?: AccessCard;
};

type Association = {
  id: string;
  name: string;
  shortName: string;
  email: string;
  category: string;
};

const eventTypes = [
  { value: "AGO", label: "Assemblée Générale Ordinaire" },
  { value: "AGE", label: "Assemblée Générale Extraordinaire" },
  { value: "CONGRES", label: "Congrès" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "FORMATION", label: "Formation" },
  { value: "AUTRE", label: "Autre" },
];

const eventTypeColors: Record<string, string> = {
  AGO: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  AGE: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  CONGRES: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FESTIVAL: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  FORMATION: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  AUTRE: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

// FICAV default colors
const FICAV_COLORS = {
  primary: "#F97316",
  secondary: "#FFFFFF",
  accent: "#000000",
};

export default function AccessCardsPage() {
  const [events, setEvents] = useState<FederationEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<FederationEvent | null>(null);
  const [accessCards, setAccessCards] = useState<AccessCard[]>([]);
  const [attendances, setAttendances] = useState<EventAttendance[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cards");
  const [ficavLogo, setFicavLogo] = useState("/images/logo-ficav-official.png");

  // Dialog states
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  // Form states
  const [editingEvent, setEditingEvent] = useState<Partial<FederationEvent>>({});
  const [editingCard, setEditingCard] = useState<Partial<AccessCard>>({});
  const [printCards, setPrintCards] = useState<AccessCard[]>([]);

  const printRef = useRef<HTMLDivElement>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchEvents();
    fetchAssociations();
    fetchSettings();
  }, []);

  // Fetch cards when event changes
  useEffect(() => {
    if (selectedEvent) {
      fetchAccessCards(selectedEvent.id);
      fetchAttendances(selectedEvent.id);
    }
  }, [selectedEvent]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/federation/settings");
      const data = await response.json();
      if (data?.logoUrl) {
        setFicavLogo(data.logoUrl);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/federation/events");
      const data = await response.json();
      const eventsList = Array.isArray(data) ? data : [];
      setEvents(eventsList);
      if (eventsList.length > 0 && !selectedEvent) {
        setSelectedEvent(eventsList[0]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Erreur lors du chargement des événements");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccessCards = async (eventId: string) => {
    try {
      const response = await fetch(`/api/federation/access-cards?eventId=${eventId}`);
      const data = await response.json();
      setAccessCards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching access cards:", error);
      setAccessCards([]);
    }
  };

  const fetchAttendances = async (eventId: string) => {
    try {
      const response = await fetch(`/api/federation/attendance?eventId=${eventId}`);
      const data = await response.json();
      setAttendances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching attendances:", error);
      setAttendances([]);
    }
  };

  const fetchAssociations = async () => {
    try {
      const response = await fetch("/api/admin/associations?limit=100");
      const data = await response.json();
      const associationsList = data.associations || data || [];
      setAssociations(associationsList.map((a: { id: string; name: string; slug: string }) => ({
        id: a.id,
        name: a.name,
        shortName: a.slug?.toUpperCase() || a.name.substring(0, 4).toUpperCase(),
        email: "",
        category: "",
      })));
    } catch (error) {
      console.error("Error fetching associations:", error);
    }
  };

  // Event CRUD
  const handleSaveEvent = async () => {
    try {
      const method = editingEvent.id ? "PUT" : "POST";
      const url = editingEvent.id
        ? `/api/federation/events/${editingEvent.id}`
        : "/api/federation/events";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEvent),
      });

      if (!response.ok) throw new Error("Failed to save event");

      toast.success(editingEvent.id ? "Événement mis à jour" : "Événement créé");
      setIsEventDialogOpen(false);
      setEditingEvent({});
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Erreur lors de la sauvegarde de l'événement");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement et toutes ses cartes ?")) return;

    try {
      const response = await fetch(`/api/federation/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      toast.success("Événement supprimé");
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Erreur lors de la suppression de l'événement");
    }
  };

  // Card CRUD
  const handleSaveCard = async () => {
    if (!selectedEvent) return;

    try {
      const method = editingCard.id ? "PUT" : "POST";
      const url = editingCard.id
        ? `/api/federation/access-cards/${editingCard.id}`
        : "/api/federation/access-cards";

      const cardData = {
        ...editingCard,
        eventId: selectedEvent.id,
        isActivated: true,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) throw new Error("Failed to save card");

      toast.success(editingCard.id ? "Carte mise à jour" : "Carte créée");
      setIsCardDialogOpen(false);
      setEditingCard({});
      fetchAccessCards(selectedEvent.id);
    } catch (error) {
      console.error("Error saving card:", error);
      toast.error("Erreur lors de la sauvegarde de la carte");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) return;

    try {
      const response = await fetch(`/api/federation/access-cards/${cardId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete card");

      toast.success("Carte supprimée");
      if (selectedEvent) {
        fetchAccessCards(selectedEvent.id);
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Erreur lors de la suppression de la carte");
    }
  };

  // Print functionality
  const handlePrintCards = (cards: AccessCard[]) => {
    if (cards.length === 0) {
      toast.error("Sélectionnez au moins une carte à imprimer");
      return;
    }
    setPrintCards(cards);
    setIsPrintDialogOpen(true);
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Veuillez autoriser les popups pour imprimer");
      return;
    }

    const printContent = printRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cartes d'accès PVC - ${selectedEvent?.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; background: white; }
            .card-container {
              display: flex;
              flex-wrap: wrap;
              gap: 0;
              justify-content: flex-start;
            }
            .card {
              width: 53.98mm;
              height: 85.6mm;
              border: 1px solid #000;
              page-break-inside: avoid;
              position: relative;
              overflow: hidden;
              background: white;
            }
            .card-number {
              position: absolute;
              top: 8px;
              right: 8px;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
              color: white;
            }
            @media print {
              .card { border: 1px solid #000; }
              @page { size: A4 portrait; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="card-container">${printContent}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Stats
  const stats = {
    totalCards: accessCards.length,
    activatedCards: accessCards.filter((c) => c.isActivated).length,
    scannedCards: attendances.length,
    pendingSend: attendances.filter((a) => !a.sentToSecretary).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
            Cartes d&apos;accès
          </h1>
          <p className="text-muted-foreground">
            Gérez les cartes d&apos;accès PVC pour les événements de la Fédération
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent({});
            setIsEventDialogOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-500/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel événement
        </Button>
      </div>

      {/* Event Selector */}
      <Card className="glass-card border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Label className="text-sm whitespace-nowrap">Événement:</Label>
              <Select
                value={selectedEvent?.id || ""}
                onValueChange={(value) => {
                  const event = events.find((e) => e.id === value);
                  setSelectedEvent(event || null);
                }}
              >
                <SelectTrigger className="w-full md:w-80 bg-background/50">
                  <SelectValue placeholder="Sélectionner un événement" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} ({event.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedEvent && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingEvent(selectedEvent);
                    setIsEventDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <>
          {/* Event Info Banner */}
          <Card className="glass-card border-orange-500/30 bg-orange-500/5">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={eventTypeColors[selectedEvent.type]}>
                      {selectedEvent.type}
                    </Badge>
                    <h3 className="font-display font-bold text-foreground">
                      {selectedEvent.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedEvent.date)}
                    </span>
                    {selectedEvent.startTime && (
                      <span className="flex items-center gap-1">
                        <Clock3 className="w-4 h-4" />
                        {selectedEvent.startTime}
                        {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                      </span>
                    )}
                    {selectedEvent.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedEvent.venue}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total cartes", value: stats.totalCards, icon: IdCard, color: "text-muted-foreground" },
              { label: "Activées", value: stats.activatedCards, icon: CheckCircle2, color: "text-green-400" },
              { label: "Scannées", value: stats.scannedCards, icon: QrCode, color: "text-blue-400" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-xl font-display font-bold mt-1">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Aperçu et Impression PVC Section */}
          <Card className="glass-card border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <IdCard className="w-5 h-5 text-orange-500" />
                Aperçu et Impression PVC
              </CardTitle>
              <CardDescription>
                Visualisez et imprimez les cartes d&apos;accès au format portrait PVC (53.98mm × 85.6mm)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Card Preview - Portrait Format */}
                <div className="flex-shrink-0">
                  <div
                    className="relative bg-white rounded-lg shadow-xl overflow-hidden border-2 border-gray-200"
                    style={{
                      width: "215.92px",
                      height: "342.4px",
                    }}
                  >
                    {/* Card Number */}
                    <div
                      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold z-10"
                      style={{ backgroundColor: selectedEvent.primaryColor }}
                    >
                      1
                    </div>

                    {/* Header */}
                    <div
                      className="px-3 py-4 flex flex-col items-center justify-center text-center"
                      style={{ backgroundColor: selectedEvent.primaryColor }}
                    >
                      <div className="relative w-16 h-16 mb-1 bg-white rounded p-1">
                        <Image
                          src={ficavLogo}
                          alt="FICAV"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span
                        className="mt-1 px-2 py-0.5 text-xs font-bold rounded"
                        style={{
                          backgroundColor: selectedEvent.secondaryColor,
                          color: selectedEvent.primaryColor,
                        }}
                      >
                        {selectedEvent.type || "AGO"}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-3 flex flex-col gap-2">
                      <p className="text-[10px] font-bold text-center text-gray-700 leading-tight">
                        {selectedEvent.name || "Assemblée Générale 2025"}
                      </p>

                      <div className="flex justify-between text-[8px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(selectedEvent.date || new Date().toISOString())}
                        </span>
                        {selectedEvent.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock3 className="w-3 h-3" />
                            {selectedEvent.startTime}
                          </span>
                        )}
                      </div>

                      {selectedEvent.venue && (
                        <p className="text-[8px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedEvent.venue}
                        </p>
                      )}

                      {/* Association */}
                      <div
                        className="mt-2 p-2 rounded text-center"
                        style={{ backgroundColor: `${selectedEvent.primaryColor}10` }}
                      >
                        <p className="text-[9px] text-gray-600">Association Membre</p>
                        <p
                          className="text-xl font-bold mt-1"
                          style={{ color: selectedEvent.primaryColor }}
                        >
                          AACI
                        </p>
                      </div>

                      {/* Representative */}
                      <div className="flex justify-between items-center text-[9px] pt-2 border-t border-gray-100">
                        <span className="font-medium text-gray-700">Kouame Jean</span>
                        <span className="text-gray-500">Président</span>
                      </div>

                      {/* QR Code */}
                      <div className="flex justify-center mt-2">
                        <div className="border border-gray-200 p-1 bg-white">
                          <QRCodeSVG
                            value={`FICAV-PREVIEW-${Date.now()}`}
                            size={60}
                            level="H"
                            includeMargin={false}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      className="absolute bottom-0 left-0 right-0 px-3 py-2 flex justify-between items-center text-white text-[7px]"
                      style={{ backgroundColor: selectedEvent.accentColor }}
                    >
                      <span className="font-mono">FICAV-AACI-AGO-001</span>
                      <span style={{ color: selectedEvent.primaryColor }}>FICAV</span>
                    </div>
                  </div>
                </div>

                {/* Actions and Info */}
                <div className="flex-1 space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-medium mb-2 text-sm">Format d&apos;impression</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">Dimensions:</span> 53.98mm × 85.6mm (CR80)
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Orientation:</span> Portrait
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Couleurs:</span> FICAV (Orange/Blanc/Noir)
                      </div>
                      <div>
                        <span className="font-medium text-foreground">QR Code:</span> Unique par carte
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="bg-orange-500 hover:bg-orange-500/90 text-white"
                      onClick={() => {
                        if (accessCards.filter((c) => c.isActivated).length > 0) {
                          handlePrintCards(accessCards.filter((c) => c.isActivated));
                        } else {
                          toast.info("Créez d'abord des cartes à imprimer");
                        }
                      }}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimer en format PVC
                    </Button>
                  </div>

                  {accessCards.filter((c) => c.isActivated).length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {accessCards.filter((c) => c.isActivated).length} carte(s) prête(s) à imprimer
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cards">Cartes d&apos;accès</TabsTrigger>
              <TabsTrigger value="attendance">Présences</TabsTrigger>
            </TabsList>

            {/* Cards Tab */}
            <TabsContent value="cards" className="space-y-4">
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => {
                    setEditingCard({
                      primaryColor: selectedEvent.primaryColor,
                      secondaryColor: selectedEvent.secondaryColor,
                      accentColor: selectedEvent.accentColor,
                    });
                    setIsCardDialogOpen(true);
                  }}
                  className="bg-orange-500 hover:bg-orange-500/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle carte
                </Button>
                {accessCards.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => handlePrintCards(accessCards.filter((c) => c.isActivated))}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer toutes les cartes
                  </Button>
                )}
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {accessCards.length === 0 ? (
                  <Card className="glass-card border-border/30">
                    <CardContent className="p-8 text-center">
                      <IdCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Aucune carte créée pour cet événement.
                        <br />
                        Cliquez sur &quot;Nouvelle carte&quot; pour commencer.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  accessCards.map((card, index) => {
                    const primaryColor = card.primaryColor || selectedEvent.primaryColor;
                    const accentColor = card.accentColor || selectedEvent.accentColor;

                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="glass-card border-border/30 hover:border-primary/30 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              {/* Card Preview Mini */}
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-16 h-24 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold shadow-md"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  <span>FICAV</span>
                                  <span
                                    className="text-[10px] mt-1 px-1 rounded"
                                    style={{ backgroundColor: card.secondaryColor || selectedEvent.secondaryColor, color: primaryColor }}
                                  >
                                    {selectedEvent.type}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-display font-bold text-foreground">
                                      {card.associationName}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                      style={{
                                        backgroundColor: `${primaryColor}15`,
                                        color: primaryColor,
                                        borderColor: `${primaryColor}30`,
                                      }}
                                    >
                                      {card.associationShortName}
                                    </Badge>
                                    <span
                                      className="text-xs px-2 py-0.5 rounded-full text-white"
                                      style={{ backgroundColor: accentColor }}
                                    >
                                      #{card.cardNumber}
                                    </span>
                                  </div>
                                  {card.representativeFirstName && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {card.representativeFirstName} {card.representativeLastName}
                                      {card.representativeFunction && ` - ${card.representativeFunction}`}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span className="font-mono">{card.cardId}</span>
                                    {card.isActivated && (
                                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Activée
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCard(card);
                                    setIsCardDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleDeleteCard(card.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-4">
              {attendances.length === 0 ? (
                <Card className="glass-card border-border/30">
                  <CardContent className="p-8 text-center">
                    <QrCode className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucune présence enregistrée pour cet événement.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {attendances.map((attendance, index) => (
                    <motion.div
                      key={attendance.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card border-border/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {attendance.card?.associationName || "Association"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Scanné le {formatDate(attendance.scannedAt)}
                              </p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="glass-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingEvent.id ? "Modifier l'événement" : "Nouvel événement"}
            </DialogTitle>
            <DialogDescription>
              Configurez les détails de l&apos;événement et les couleurs des cartes
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label>Nom de l&apos;événement</Label>
              <Input
                value={editingEvent.name || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                placeholder="Assemblée Générale 2025"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={editingEvent.type || "AGO"}
                onValueChange={(value) => setEditingEvent({ ...editingEvent, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={editingEvent.date ? editingEvent.date.split("T")[0] : ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Heure de début</Label>
              <Input
                type="time"
                value={editingEvent.startTime || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Heure de fin</Label>
              <Input
                type="time"
                value={editingEvent.endTime || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Lieu</Label>
              <Input
                value={editingEvent.venue || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                placeholder="Palais des Congrès, Abidjan"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-500/90 text-white"
              onClick={handleSaveEvent}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent className="glass-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingCard.id ? "Modifier la carte" : "Nouvelle carte d'accès"}
            </DialogTitle>
            <DialogDescription>
              Créez une carte d&apos;accès pour un représentant d&apos;association
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label>Association</Label>
              <Select
                value={editingCard.associationId || ""}
                onValueChange={(value) => {
                  const assoc = associations.find((a) => a.id === value);
                  if (assoc) {
                    setEditingCard({
                      ...editingCard,
                      associationId: assoc.id,
                      associationName: assoc.name,
                      associationShortName: assoc.shortName,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une association" />
                </SelectTrigger>
                <SelectContent>
                  {associations.map((assoc) => (
                    <SelectItem key={assoc.id} value={assoc.id}>
                      {assoc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(!editingCard.associationId || editingCard.associationId === "manual") && (
              <>
                <div className="space-y-2 col-span-2">
                  <Label>Nom de l&apos;association</Label>
                  <Input
                    value={editingCard.associationName || ""}
                    onChange={(e) => setEditingCard({ ...editingCard, associationName: e.target.value })}
                    placeholder="Association des Cinéastes Ivoiriens"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Sigle</Label>
                  <Input
                    value={editingCard.associationShortName || ""}
                    onChange={(e) => setEditingCard({ ...editingCard, associationShortName: e.target.value })}
                    placeholder="ACI"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Prénom du représentant</Label>
              <Input
                value={editingCard.representativeFirstName || ""}
                onChange={(e) => setEditingCard({ ...editingCard, representativeFirstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nom du représentant</Label>
              <Input
                value={editingCard.representativeLastName || ""}
                onChange={(e) => setEditingCard({ ...editingCard, representativeLastName: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Fonction</Label>
              <Input
                value={editingCard.representativeFunction || ""}
                onChange={(e) => setEditingCard({ ...editingCard, representativeFunction: e.target.value })}
                placeholder="Président, Secrétaire, etc."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCardDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-500/90 text-white"
              onClick={handleSaveCard}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="glass-card max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Printer className="w-5 h-5 text-orange-500" />
              Impression des cartes PVC
            </DialogTitle>
            <DialogDescription>
              {printCards.length} carte(s) à imprimer - Format portrait
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="mt-4">
              {/* Print Preview Grid */}
              <div
                ref={printRef}
                className="grid grid-cols-3 gap-2 bg-gray-100 p-2 rounded-lg"
              >
                {printCards.map((card, index) => {
                  const primaryColor = card.primaryColor || selectedEvent.primaryColor;
                  const secondaryColor = card.secondaryColor || selectedEvent.secondaryColor;
                  const accentColor = card.accentColor || selectedEvent.accentColor;

                  return (
                    <div
                      key={card.id || index}
                      className="card bg-white border border-gray-300 relative overflow-hidden"
                      style={{
                        width: "100%",
                        aspectRatio: "53.98/85.6",
                      }}
                    >
                      {/* Card Number */}
                      <div
                        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold z-10"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {card.cardNumber}
                      </div>

                      {/* Header */}
                      <div
                        className="px-2 py-2 flex flex-col items-center justify-center text-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <div className="relative w-10 h-10 bg-white rounded p-0.5">
                          <Image
                            src={ficavLogo}
                            alt="FICAV"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span
                          className="mt-0.5 px-1.5 py-0.5 text-[8px] font-bold rounded"
                          style={{ backgroundColor: secondaryColor, color: primaryColor }}
                        >
                          {selectedEvent.type}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-2 flex flex-col gap-1">
                        <p className="text-[7px] font-bold text-center text-gray-700 leading-tight">
                          {selectedEvent.name}
                        </p>

                        <div className="flex justify-between text-[6px] text-gray-500">
                          <span>{formatDate(selectedEvent.date)}</span>
                          {selectedEvent.startTime && <span>{selectedEvent.startTime}</span>}
                        </div>

                        <div
                          className="my-1 p-1 rounded text-center"
                          style={{ backgroundColor: `${primaryColor}10` }}
                        >
                          <p className="text-[6px] text-gray-600">{card.associationName}</p>
                          <p className="text-sm font-bold" style={{ color: primaryColor }}>
                            {card.associationShortName}
                          </p>
                        </div>

                        {(card.representativeFirstName || card.representativeLastName) && (
                          <div className="flex justify-between text-[7px] pt-1 border-t border-gray-100">
                            <span className="font-medium">
                              {card.representativeFirstName} {card.representativeLastName}
                            </span>
                            {card.representativeFunction && (
                              <span className="text-gray-500">{card.representativeFunction}</span>
                            )}
                          </div>
                        )}

                        {/* QR Code */}
                        <div className="flex justify-center mt-1">
                          <div className="border border-gray-200 p-0.5 bg-white">
                            <QRCodeSVG
                              value={card.cardId}
                              size={35}
                              level="L"
                              includeMargin={false}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div
                        className="absolute bottom-0 left-0 right-0 px-2 py-1 flex justify-between items-center text-white text-[6px]"
                        style={{ backgroundColor: accentColor }}
                      >
                        <span className="font-mono truncate">{card.cardId}</span>
                        <span style={{ color: primaryColor }}>FICAV</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Print Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPrintDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-500/90 text-white"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </div>

              {/* Print Tips */}
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-400 font-medium">Conseils d&apos;impression:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Format carte PVC portrait: 53.98mm × 85.6mm</li>
                  <li>• Utilisez du papier PVC ou cartonné épais (300g/m² minimum)</li>
                  <li>• Impression en couleur recommandée</li>
                  <li>• Vérifiez que les QR codes sont lisibles avant de découper</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
