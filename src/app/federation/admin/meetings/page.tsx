"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock meetings data
const meetingsData = [
  {
    id: "1",
    title: "Assemblée Générale Ordinaire 2025",
    type: "AGO",
    date: "2025-02-15",
    time: "09:00",
    endTime: "13:00",
    location: "Salle de conférence FICAV, Plateau",
    isOnline: false,
    videoLink: null,
    agenda: [
      "Rapport moral du Président",
      "Rapport financier de la Trésorière",
      "Rapport d'activités du Secrétaire Général",
      "Élection des nouveaux membres du Bureau",
      "Questions diverses",
    ],
    status: "scheduled",
    invitedAssociations: 12,
    confirmedAttendees: 8,
    sentAt: "2025-01-10",
  },
  {
    id: "2",
    title: "Réunion extraordinaire - Financement",
    type: "EXTRAORDINAIRE",
    date: "2025-01-25",
    time: "14:00",
    endTime: "17:00",
    location: "En ligne",
    isOnline: true,
    videoLink: "https://meet.ficav.ci/reunion-25012025",
    agenda: [
      "Présentation des nouvelles opportunités de financement",
      "Discussion sur le fonds de soutien",
      "Vote sur la répartition des subventions",
    ],
    status: "scheduled",
    invitedAssociations: 12,
    confirmedAttendees: 6,
    sentAt: "2025-01-15",
  },
  {
    id: "3",
    title: "Conseil d'Administration",
    type: "CA",
    date: "2025-01-08",
    time: "10:00",
    endTime: "12:00",
    location: "Bureau FICAV",
    isOnline: false,
    videoLink: null,
    agenda: [
      "Validation des nouveaux membres",
      "Calendrier des activités 2025",
      "Budget prévisionnel",
    ],
    status: "completed",
    invitedAssociations: 5,
    confirmedAttendees: 5,
    sentAt: "2025-01-02",
    reportLink: "/documents/cr-ca-08012025.pdf",
  },
];

const associations = [
  { id: "1", name: "Association des Acteurs de Côte d'Ivoire", shortName: "AACI" },
  { id: "2", name: "Association des Réalisateurs de Côte d'Ivoire", shortName: "ARCI" },
  { id: "3", name: "Association des Producteurs de Côte d'Ivoire", shortName: "APCI" },
  { id: "4", name: "Association des Scénaristes de Côte d'Ivoire", shortName: "ASCI" },
  { id: "5", name: "Association des Techniciens de Côte d'Ivoire", shortName: "ATCI" },
  { id: "6", name: "Association des Distributeurs de Côte d'Ivoire", shortName: "ADCI" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Brouillon", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  scheduled: { label: "Planifiée", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  completed: { label: "Terminée", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  cancelled: { label: "Annulée", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  AGO: { label: "Assemblée Générale", color: "bg-primary/10 text-primary border-primary/20" },
  AGE: { label: "Assemblée Extraordinaire", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  EXTRAORDINAIRE: { label: "Réunion Extraordinaire", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  CA: { label: "Conseil d'Administration", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
};

export default function MeetingsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<typeof meetingsData[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Form state
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    type: "AGO",
    date: "",
    time: "",
    endTime: "",
    location: "",
    isOnline: false,
    videoLink: "",
    agenda: "",
    selectedAssociations: [] as string[],
  });

  const stats = {
    total: meetingsData.length,
    scheduled: meetingsData.filter((m) => m.status === "scheduled").length,
    completed: meetingsData.filter((m) => m.status === "completed").length,
  };

  const handleCreateMeeting = () => {
    console.log("Creating meeting:", meetingForm);
    alert("Convocation envoyée aux associations sélectionnées");
    setIsCreateOpen(false);
    // Reset form
    setMeetingForm({
      title: "",
      type: "AGO",
      date: "",
      time: "",
      endTime: "",
      location: "",
      isOnline: false,
      videoLink: "",
      agenda: "",
      selectedAssociations: [],
    });
  };

  const handleSendReminder = (meetingId: string) => {
    console.log("Sending reminder for meeting:", meetingId);
    alert("Rappel envoyé aux associations n'ayant pas encore confirmé");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
            Convocations aux réunions
          </h1>
          <p className="text-muted-foreground">
            Convoquez les associations membres aux réunions de la Fédération
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle convocation
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Créer une convocation
              </DialogTitle>
              <DialogDescription>
                Planifiez une réunion et convoquez les associations membres
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="title">Titre de la réunion</Label>
                  <Input
                    id="title"
                    value={meetingForm.title}
                    onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                    placeholder="Ex: Assemblée Générale Ordinaire 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type de réunion</Label>
                  <Select
                    value={meetingForm.type}
                    onValueChange={(value) => setMeetingForm({ ...meetingForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGO">Assemblée Générale Ordinaire</SelectItem>
                      <SelectItem value="AGE">Assemblée Générale Extraordinaire</SelectItem>
                      <SelectItem value="EXTRAORDINAIRE">Réunion Extraordinaire</SelectItem>
                      <SelectItem value="CA">Conseil d'Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure de début</Label>
                  <Input
                    id="time"
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Heure de fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={meetingForm.endTime}
                    onChange={(e) => setMeetingForm({ ...meetingForm, endTime: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="location">Lieu</Label>
                  <Input
                    id="location"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                    placeholder="Ex: Salle de conférence FICAV, Plateau"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={meetingForm.isOnline}
                    onChange={(e) => setMeetingForm({ ...meetingForm, isOnline: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="isOnline" className="cursor-pointer">
                    Réunion en ligne (visioconférence)
                  </Label>
                </div>
                {meetingForm.isOnline && (
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="videoLink">Lien de la visioconférence</Label>
                    <Input
                      id="videoLink"
                      value={meetingForm.videoLink}
                      onChange={(e) => setMeetingForm({ ...meetingForm, videoLink: e.target.value })}
                      placeholder="https://meet.ficav.ci/..."
                    />
                  </div>
                )}
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="agenda">Ordre du jour (un point par ligne)</Label>
                  <Textarea
                    id="agenda"
                    value={meetingForm.agenda}
                    onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                    placeholder="1. Rapport moral du Président&#10;2. Rapport financier&#10;3. Questions diverses"
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Associations à convoquer</Label>
                <div className="grid grid-cols-2 gap-2 p-4 rounded-lg bg-muted/30 max-h-48 overflow-y-auto">
                  {associations.map((assoc) => (
                    <label
                      key={assoc.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={meetingForm.selectedAssociations.includes(assoc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMeetingForm({
                              ...meetingForm,
                              selectedAssociations: [...meetingForm.selectedAssociations, assoc.id],
                            });
                          } else {
                            setMeetingForm({
                              ...meetingForm,
                              selectedAssociations: meetingForm.selectedAssociations.filter(
                                (id) => id !== assoc.id
                              ),
                            });
                          }
                        }}
                        className="rounded border-border"
                      />
                      <span className="text-sm">{assoc.shortName}</span>
                    </label>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setMeetingForm({
                      ...meetingForm,
                      selectedAssociations: associations.map((a) => a.id),
                    })
                  }
                >
                  Sélectionner tout
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleCreateMeeting}
                  disabled={!meetingForm.title || !meetingForm.date || meetingForm.selectedAssociations.length === 0}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer les convocations
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total réunions", value: stats.total, icon: Calendar },
          { label: "Planifiées", value: stats.scheduled, icon: Clock },
          { label: "Terminées", value: stats.completed, icon: CheckCircle2 },
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
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetingsData.map((meeting, index) => {
          const status = statusConfig[meeting.status];
          const type = typeConfig[meeting.type];
          
          return (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-border/30 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                        <span className="font-display text-xl text-primary">
                          {new Date(meeting.date).getDate()}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {new Date(meeting.date).toLocaleDateString("fr-FR", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold text-foreground">
                            {meeting.title}
                          </h3>
                          <Badge variant="outline" className={type.color}>
                            {type.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {meeting.time} - {meeting.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            {meeting.isOnline ? (
                              <>
                                <Video className="w-4 h-4" />
                                En ligne
                              </>
                            ) : (
                              <>
                                <MapPin className="w-4 h-4" />
                                {meeting.location}
                              </>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {meeting.confirmedAttendees}/{meeting.invitedAssociations} confirmés
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMeeting(meeting);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                      {meeting.status === "scheduled" && (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleSendReminder(meeting.id)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Rappel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {selectedMeeting?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedMeeting && typeConfig[selectedMeeting.type].label}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMeeting && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedMeeting.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Horaires</p>
                  <p className="font-medium">{selectedMeeting.time} - {selectedMeeting.endTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Lieu</p>
                  <p className="font-medium flex items-center gap-2">
                    {selectedMeeting.isOnline ? (
                      <>
                        <Video className="w-4 h-4" />
                        <a
                          href={selectedMeeting.videoLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedMeeting.videoLink}
                        </a>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" />
                        {selectedMeeting.location}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Ordre du jour</p>
                <ul className="space-y-2">
                  {selectedMeeting.agenda.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary shrink-0">
                        {idx + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">Participations</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedMeeting.confirmedAttendees} sur {selectedMeeting.invitedAssociations} associations ont confirmé
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-display text-xl">{selectedMeeting.confirmedAttendees}</span>
                </div>
              </div>

              {selectedMeeting.status === "completed" && selectedMeeting.reportLink && (
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Télécharger le compte-rendu
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
