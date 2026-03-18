"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  EyeOff,
  Globe,
} from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "FESTIVAL" | "ASSEMBLY" | "TRAINING" | "PROJECTION" | "CONFERENCE" | "WORKSHOP";
  venue: string | null;
  city: string | null;
  startDate: string;
  endDate: string | null;
  maxAttendees: number | null;
  isPublished: boolean;
  association: {
    name: string;
    slug: string;
  } | null;
  createdAt: string;
}

const eventSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  type: z.enum(["FESTIVAL", "ASSEMBLY", "TRAINING", "PROJECTION", "CONFERENCE", "WORKSHOP"]),
  venue: z.string().optional(),
  city: z.string().optional(),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  maxAttendees: z.number().optional(),
});

type EventForm = z.infer<typeof eventSchema>;

const sampleEvents: Event[] = [
  {
    id: "1",
    slug: "festival-cinema-abidjan-2025",
    title: "Festival du Cinéma d'Abidjan 2025",
    description: "La 16ème édition du plus grand festival de cinéma de Côte d'Ivoire",
    type: "FESTIVAL",
    venue: "Palais de la Culture",
    city: "Abidjan",
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    maxAttendees: 2000,
    isPublished: true,
    association: { name: "FICAV", slug: "ficav" },
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    slug: "assemblee-generale-ficav",
    title: "Assemblée Générale Annuelle FICAV",
    description: "Bilan annuel et perspectives pour l'année à venir",
    type: "ASSEMBLY",
    venue: "Siège FICAV",
    city: "Abidjan",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: null,
    maxAttendees: 150,
    isPublished: true,
    association: { name: "FICAV", slug: "ficav" },
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    slug: "masterclass-realisation",
    title: "Masterclass Réalisation",
    description: "Apprenez les techniques de réalisation avec des professionnels",
    type: "TRAINING",
    venue: "Institut Français",
    city: "Abidjan",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: null,
    maxAttendees: 50,
    isPublished: true,
    association: { name: "ARPA", slug: "arpa" },
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    slug: "projection-run",
    title: "Avant-première \"Run\"",
    description: "Projection exclusive du dernier film ivoirien primé",
    type: "PROJECTION",
    venue: "Cinéma Majestic",
    city: "Abidjan",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: null,
    maxAttendees: 300,
    isPublished: true,
    association: { name: "ARPA", slug: "arpa" },
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    slug: "conference-cinema",
    title: "Conférence : L'état du cinéma ivoirien",
    description: "Table ronde avec des experts de l'industrie",
    type: "CONFERENCE",
    venue: "Université Félix Houphouët-Boigny",
    city: "Abidjan",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: null,
    maxAttendees: 200,
    isPublished: false,
    association: { name: "ARPACI", slug: "arpaci" },
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    slug: "atelier-scenario",
    title: "Atelier d'Écriture Scénaristique",
    description: "Atelier pratique pour apprendre l'écriture scénaristique",
    type: "WORKSHOP",
    venue: "Maison de la Culture",
    city: "Abidjan",
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    maxAttendees: 25,
    isPublished: true,
    association: { name: "SACI", slug: "saci" },
    createdAt: "2024-02-20",
  },
  {
    id: "7",
    slug: "festival-court-metrage",
    title: "Festival du Court Métrage de Yamoussoukro",
    description: "Le festival dédié aux courts métrages africains",
    type: "FESTIVAL",
    venue: "Centre Culturel Municipal",
    city: "Yamoussoukro",
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    maxAttendees: 800,
    isPublished: true,
    association: { name: "FICAV", slug: "ficav" },
    createdAt: "2024-03-01",
  },
  {
    id: "8",
    slug: "formation-son",
    title: "Formation Technique : Le Son au Cinéma",
    description: "Formation intensive sur les techniques de prise de son",
    type: "TRAINING",
    venue: "Studio National",
    city: "Abidjan",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: null,
    maxAttendees: 20,
    isPublished: true,
    association: { name: "ATIC", slug: "atic" },
    createdAt: "2023-12-15",
  },
];

const eventTypes = [
  { value: "FESTIVAL", label: "Festival", color: "text-purple-400" },
  { value: "ASSEMBLY", label: "Assemblée", color: "text-blue-400" },
  { value: "TRAINING", label: "Formation", color: "text-green-400" },
  { value: "PROJECTION", label: "Projection", color: "text-yellow-400" },
  { value: "CONFERENCE", label: "Conférence", color: "text-orange-400" },
  { value: "WORKSHOP", label: "Atelier", color: "text-pink-400" },
];

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      type: "FESTIVAL",
      venue: "",
      city: "",
      startDate: "",
      endDate: "",
      maxAttendees: undefined,
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setEvents(sampleEvents);
      setLoading(false);
    }, 500);
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleAddEvent = () => {
    form.reset();
    setIsAddDialogOpen(true);
  };

  const onSubmit = async (data: EventForm) => {
    const newEvent: Event = {
      id: String(events.length + 1),
      slug: data.slug,
      title: data.title,
      description: data.description || null,
      type: data.type,
      venue: data.venue || null,
      city: data.city || null,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      maxAttendees: data.maxAttendees || null,
      isPublished: false,
      association: null,
      createdAt: new Date().toISOString(),
    };
    setEvents([newEvent, ...events]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    // Navigate to edit page
    console.log("Edit event:", event.id);
  };

  const handleDelete = (event: Event) => {
    setDeleteEventId(event.id);
  };

  const confirmDelete = () => {
    if (deleteEventId) {
      setEvents(events.filter((e) => e.id !== deleteEventId));
      setDeleteEventId(null);
    }
  };

  const handleTogglePublish = (event: Event) => {
    setEvents(
      events.map((e) =>
        e.id === event.id ? { ...e, isPublished: !e.isPublished } : e
      )
    );
  };

  const getTypeBadge = (type: Event["type"]) => {
    const typeInfo = eventTypes.find((t) => t.value === type);
    return (
      <Badge
        variant="outline"
        className={cn("border-current", typeInfo?.color)}
      >
        {typeInfo?.label || type}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  const columns: Column<Event>[] = [
    {
      key: "title",
      header: "Événement",
      sortable: true,
      render: (event) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground truncate max-w-xs">
              {event.title}
            </div>
            <div className="text-xs text-muted-foreground">{event.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (event) => getTypeBadge(event.type),
    },
    {
      key: "city",
      header: "Lieu",
      sortable: true,
      render: (event) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate max-w-32">{event.city || event.venue || "-"}</span>
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Date",
      sortable: true,
      render: (event) => (
        <div>
          <div className="text-sm text-foreground">
            {new Date(event.startDate).toLocaleDateString("fr-FR")}
          </div>
          <div className="text-xs text-muted-foreground">
            {isUpcoming(event.startDate) ? "À venir" : "Passé"}
          </div>
        </div>
      ),
    },
    {
      key: "maxAttendees",
      header: "Capacité",
      sortable: true,
      render: (event) => (
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span>{event.maxAttendees || "-"}</span>
        </div>
      ),
    },
    {
      key: "isPublished",
      header: "Statut",
      sortable: true,
      render: (event) => (
        event.isPublished ? (
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
            <Globe className="h-3 w-3 mr-1" />
            Publié
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
            <EyeOff className="h-3 w-3 mr-1" />
            Non publié
          </Badge>
        )
      ),
    },
  ];

  const getActions = (event: Event) => [
    { label: "Voir", onClick: () => handleView(event) },
    { label: "Modifier", onClick: () => handleEdit(event) },
    {
      label: event.isPublished ? "Dépublier" : "Publier",
      onClick: () => handleTogglePublish(event),
    },
    { label: "Supprimer", onClick: () => handleDelete(event), variant: "destructive" as const },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b border-border/50 px-6 bg-card/30">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">Gestion des Événements</h1>
            <p className="text-sm text-muted-foreground">
              Gérer les événements de la FICAV
            </p>
          </div>
          <Button onClick={handleAddEvent} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </header>

        <main className="flex-1 p-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Liste des événements ({events.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={events}
                columns={columns}
                searchPlaceholder="Rechercher un événement..."
                searchKeys={["title", "slug", "venue", "city"]}
                actions={getActions}
                loading={loading}
                emptyMessage="Aucun événement trouvé"
              />
            </CardContent>
          </Card>
        </main>

        {/* Add Event Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Ajouter un événement</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire pour créer un nouvel événement.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Titre de l'événement"
                            className="bg-muted/50"
                            onChange={(e) => {
                              field.onChange(e);
                              form.setValue("slug", generateSlug(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="slug-evenement" className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Description de l'événement"
                          className="bg-muted/50 min-h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-muted/50">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacité max</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="100"
                            className="bg-muted/50"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lieu</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Palais de la Culture" className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Abidjan" className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de début *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            className="bg-muted/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de fin</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            className="bg-muted/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Créer
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Event Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Détails de l'événement</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {selectedEvent.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeBadge(selectedEvent.type)}
                      {selectedEvent.isPublished ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                          Publié
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
                          Non publié
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm text-foreground">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Date de début</p>
                    <p className="font-medium text-foreground text-sm">
                      {formatDate(selectedEvent.startDate)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Date de fin</p>
                    <p className="font-medium text-foreground text-sm">
                      {selectedEvent.endDate ? formatDate(selectedEvent.endDate) : "-"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Lieu</p>
                    <p className="font-medium text-foreground">
                      {selectedEvent.venue || "-"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Ville</p>
                    <p className="font-medium text-foreground">{selectedEvent.city || "-"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Capacité</p>
                    <p className="font-medium text-foreground flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {selectedEvent.maxAttendees || "Illimitée"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Organisateur</p>
                    <p className="font-medium text-foreground">
                      {selectedEvent.association?.name || "FICAV"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Supprimer l'événement</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
