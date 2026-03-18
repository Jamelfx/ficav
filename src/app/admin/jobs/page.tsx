"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
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

interface Job {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "EMPLOI" | "CASTING" | "APPEL_PROJET" | "STAGE" | "FORMATION";
  location: string | null;
  isRemote: boolean;
  salary: string | null;
  deadline: string | null;
  isFilled: boolean;
  isPublished: boolean;
  contactEmail: string | null;
  contactPhone: string | null;
  association: {
    name: string;
    slug: string;
  } | null;
  createdAt: string;
}

const jobSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  type: z.enum(["EMPLOI", "CASTING", "APPEL_PROJET", "STAGE", "FORMATION"]),
  location: z.string().optional(),
  isRemote: z.boolean().optional(),
  salary: z.string().optional(),
  deadline: z.string().optional(),
  contactEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

type JobForm = z.infer<typeof jobSchema>;

const sampleJobs: Job[] = [
  {
    id: "1",
    slug: "assistant-realisation",
    title: "Assistant à la Réalisation",
    description: "Nous recherchons un assistant réalisateur pour un long métrage",
    type: "EMPLOI",
    location: "Abidjan",
    isRemote: false,
    salary: "500 000 - 800 000 FCFA/mois",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isFilled: false,
    isPublished: true,
    contactEmail: "recrutement@aprocib.org",
    contactPhone: "+225 07 00 00 00",
    association: { name: "APROCIB", slug: "aprocib" },
    createdAt: "2024-03-01",
  },
  {
    id: "2",
    slug: "casting-acteur-principal",
    title: "Casting Acteur Principal Masculin",
    description: "Casting pour le rôle principal masculin d'un nouveau film",
    type: "CASTING",
    location: "Abidjan",
    isRemote: false,
    salary: "Selon expérience",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isFilled: false,
    isPublished: true,
    contactEmail: "casting@arpa.org",
    contactPhone: "+225 07 11 11 11",
    association: { name: "ARPA", slug: "arpa" },
    createdAt: "2024-03-05",
  },
  {
    id: "3",
    slug: "appel-projets-courts-metrages",
    title: "Appel à Projets: Courts Métrages Jeunesse",
    description: "Appel à projets pour des courts métrages destinés à la jeunesse",
    type: "APPEL_PROJET",
    location: "Abidjan",
    isRemote: true,
    salary: "Bourse de 2 000 000 FCFA",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isFilled: false,
    isPublished: true,
    contactEmail: "projets@ficav.org",
    contactPhone: null,
    association: { name: "FICAV", slug: "ficav" },
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    slug: "stage-monteur-video",
    title: "Stage Monteur Vidéo",
    description: "Stage de 6 mois pour un monteur vidéo débutant",
    type: "STAGE",
    location: "Abidjan",
    isRemote: false,
    salary: "Indemnité de stage",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isFilled: false,
    isPublished: true,
    contactEmail: "rh@atic-ci.org",
    contactPhone: "+225 07 22 22 22",
    association: { name: "ATIC", slug: "atic" },
    createdAt: "2024-03-15",
  },
  {
    id: "5",
    slug: "formation-ecriture-scenaristique",
    title: "Formation: Écriture Scénaristique",
    description: "Formation intensive de 3 mois en écriture scénaristique",
    type: "FORMATION",
    location: "Abidjan",
    isRemote: false,
    salary: "150 000 FCFA",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    isFilled: false,
    isPublished: true,
    contactEmail: "formation@saci.org",
    contactPhone: "+225 07 33 33 33",
    association: { name: "SACI", slug: "saci" },
    createdAt: "2024-03-20",
  },
  {
    id: "6",
    slug: "technicien-son",
    title: "Technicien Son Post-Production",
    description: "Technicien son expérimenté pour la post-production",
    type: "EMPLOI",
    location: "Abidjan",
    isRemote: false,
    salary: "600 000 - 1 000 000 FCFA/mois",
    deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isFilled: true,
    isPublished: true,
    contactEmail: "rh@aprocib.org",
    contactPhone: "+225 07 44 44 44",
    association: { name: "APROCIB", slug: "aprocib" },
    createdAt: "2024-02-15",
  },
  {
    id: "7",
    slug: "directeur-photo",
    title: "Directeur de la Photographie",
    description: "Chef opérateur pour un documentaire de 52 minutes",
    type: "EMPLOI",
    location: null,
    isRemote: true,
    salary: "À négocier",
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    isFilled: false,
    isPublished: true,
    contactEmail: "production@uciav.org",
    contactPhone: null,
    association: { name: "UCIAV", slug: "uciav" },
    createdAt: "2024-03-25",
  },
];

const jobTypes = [
  { value: "EMPLOI", label: "Emploi", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { value: "CASTING", label: "Casting", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { value: "APPEL_PROJET", label: "Appel à Projets", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { value: "STAGE", label: "Stage", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { value: "FORMATION", label: "Formation", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
];

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  const form = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      type: "EMPLOI",
      location: "",
      isRemote: false,
      salary: "",
      deadline: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setJobs(sampleJobs);
      setLoading(false);
    }, 500);
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleAddJob = () => {
    form.reset();
    setIsAddDialogOpen(true);
  };

  const onSubmit = async (data: JobForm) => {
    const newJob: Job = {
      id: String(jobs.length + 1),
      slug: data.slug,
      title: data.title,
      description: data.description || null,
      type: data.type,
      location: data.location || null,
      isRemote: data.isRemote || false,
      salary: data.salary || null,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      isFilled: false,
      isPublished: false,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      association: null,
      createdAt: new Date().toISOString(),
    };
    setJobs([newJob, ...jobs]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleView = (job: Job) => {
    setSelectedJob(job);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (job: Job) => {
    console.log("Edit job:", job.id);
  };

  const handleDelete = (job: Job) => {
    setDeleteJobId(job.id);
  };

  const confirmDelete = () => {
    if (deleteJobId) {
      setJobs(jobs.filter((j) => j.id !== deleteJobId));
      setDeleteJobId(null);
    }
  };

  const handleMarkFilled = (job: Job) => {
    setJobs(
      jobs.map((j) =>
        j.id === job.id ? { ...j, isFilled: !j.isFilled } : j
      )
    );
  };

  const getTypeBadge = (type: Job["type"]) => {
    const typeInfo = jobTypes.find((t) => t.value === type);
    return (
      <Badge
        variant="outline"
        className={typeInfo?.color}
      >
        {typeInfo?.label || type}
      </Badge>
    );
  };

  const getDeadlineBadge = (deadline: string | null, isFilled: boolean) => {
    if (isFilled) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Pourvu
        </Badge>
      );
    }
    
    if (!deadline) return <span className="text-muted-foreground">-</span>;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    if (deadlineDate < now) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
          Expiré
        </Badge>
      );
    }
    
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 3) {
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
          <Clock className="h-3 w-3 mr-1" />
          {daysLeft}j restants
        </Badge>
      );
    }
    
    return (
      <span className="text-sm text-muted-foreground">
        {deadlineDate.toLocaleDateString("fr-FR")}
      </span>
    );
  };

  const columns: Column<Job>[] = [
    {
      key: "title",
      header: "Offre",
      sortable: true,
      render: (job) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground truncate max-w-xs">
              {job.title}
            </div>
            <div className="text-xs text-muted-foreground">{job.association?.name || "FICAV"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (job) => getTypeBadge(job.type),
    },
    {
      key: "location",
      header: "Lieu",
      sortable: true,
      render: (job) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{job.location || (job.isRemote ? "Remote" : "-")}</span>
          {job.isRemote && (
            <Badge variant="outline" className="ml-1 text-xs bg-muted/30">
              Remote
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "salary",
      header: "Salaire",
      sortable: false,
      render: (job) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          <span className="truncate max-w-32">{job.salary || "-"}</span>
        </div>
      ),
    },
    {
      key: "deadline",
      header: "Date limite",
      sortable: true,
      render: (job) => getDeadlineBadge(job.deadline, job.isFilled),
    },
  ];

  const getActions = (job: Job) => [
    { label: "Voir", onClick: () => handleView(job) },
    { label: "Modifier", onClick: () => handleEdit(job) },
    {
      label: job.isFilled ? "Marquer comme ouvert" : "Marquer comme pourvu",
      onClick: () => handleMarkFilled(job),
    },
    { label: "Supprimer", onClick: () => handleDelete(job), variant: "destructive" as const },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b border-border/50 px-6 bg-card/30">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">Gestion des Offres d'Emploi</h1>
            <p className="text-sm text-muted-foreground">
              Gérer les offres d'emploi, castings et formations
            </p>
          </div>
          <Button onClick={handleAddJob} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </header>

        <main className="flex-1 p-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Liste des offres ({jobs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={jobs}
                columns={columns}
                searchPlaceholder="Rechercher une offre..."
                searchKeys={["title", "slug", "location"]}
                actions={getActions}
                loading={loading}
                emptyMessage="Aucune offre trouvée"
              />
            </CardContent>
          </Card>
        </main>

        {/* Add Job Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Ajouter une offre</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire pour créer une nouvelle offre.
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
                            placeholder="Titre de l'offre"
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
                          <Input {...field} placeholder="slug-offre" className="bg-muted/50" />
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
                          placeholder="Description de l'offre"
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
                            {jobTypes.map((type) => (
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
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salaire/Rémunération</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="500 000 - 800 000 FCFA"
                            className="bg-muted/50"
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lieu</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Abidjan" className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date limite</FormLabel>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de contact</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="contact@association.org"
                            className="bg-muted/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+225 07 00 00 00"
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

        {/* View Job Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Détails de l'offre</DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {selectedJob.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeBadge(selectedJob.type)}
                      {selectedJob.isFilled && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                          Pourvu
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {selectedJob.description && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm text-foreground">{selectedJob.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Lieu</p>
                    <p className="font-medium text-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedJob.location || "Non spécifié"}
                      {selectedJob.isRemote && (
                        <Badge variant="outline" className="ml-1 text-xs">Remote</Badge>
                      )}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Salaire</p>
                    <p className="font-medium text-foreground">
                      {selectedJob.salary || "Non spécifié"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Date limite</p>
                    <p className="font-medium text-foreground">
                      {selectedJob.deadline
                        ? new Date(selectedJob.deadline).toLocaleDateString("fr-FR")
                        : "Sans limite"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Organisateur</p>
                    <p className="font-medium text-foreground">
                      {selectedJob.association?.name || "FICAV"}
                    </p>
                  </div>
                </div>

                {(selectedJob.contactEmail || selectedJob.contactPhone) && (
                  <div className="space-y-2 p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-2">Contact</p>
                    {selectedJob.contactEmail && (
                      <div className="text-sm text-foreground">{selectedJob.contactEmail}</div>
                    )}
                    {selectedJob.contactPhone && (
                      <div className="text-sm text-foreground">{selectedJob.contactPhone}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteJobId} onOpenChange={() => setDeleteJobId(null)}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Supprimer l'offre</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.
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
