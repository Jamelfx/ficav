"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Users, 
  Film, 
  Megaphone, 
  GraduationCap,
  Scale,
  Wallet,
  Briefcase,
  UserCog,
  FileText
} from "lucide-react";
import { FederationNav } from "@/components/federation/FederationNav";
import { FederationFooter } from "@/components/federation/FederationFooter";

const organizationalStructure = [
  {
    title: "Assemblée Générale",
    level: 0,
    description: "Instance suprême de la Fédération, composée de tous les membres actifs. Se réunit une fois par an pour définir les grandes orientations.",
    icon: Users,
    color: "primary",
  },
  {
    title: "Bureau Fédéral",
    level: 1,
    description: "Organe exécutif élu par l'Assemblée Générale. Comprend le Président, les Vice-Présidents, le Secrétaire Général et le Trésorier.",
    icon: Briefcase,
    color: "primary",
  },
];

const departments = [
  {
    title: "Direction Générale",
    icon: Building2,
    description: "Coordination générale des activités et gestion administrative de la Fédération.",
    responsibilities: [
      "Coordination des départements",
      "Gestion des ressources humaines",
      "Relations institutionnelles",
      "Communication interne",
    ],
  },
  {
    title: "Département Production",
    icon: Film,
    description: "Accompagnement des projets de production et soutien aux créateurs.",
    responsibilities: [
      "Soutien à la production",
      "Accompagnement des projets",
      "Gestion des équipements",
      "Mise en réseau des professionnels",
    ],
  },
  {
    title: "Département Formation",
    icon: GraduationCap,
    description: "Développement des programmes de formation et perfectionnement professionnel.",
    responsibilities: [
      "Programmes de formation",
      "Ateliers et masterclasses",
      "Certifications professionnelles",
      "Partenariats éducatifs",
    ],
  },
  {
    title: "Département Communication",
    icon: Megaphone,
    description: "Promotion de la Fédération et du cinéma ivoirien auprès du public.",
    responsibilities: [
      "Relations presse",
      "Gestion des médias sociaux",
      "Événementiel",
      "Promotion des œuvres",
    ],
  },
  {
    title: "Département Juridique",
    icon: Scale,
    description: "Protection des droits et conseil juridique pour les membres.",
    responsibilities: [
      "Conseil juridique",
      "Protection des droits d'auteur",
      "Contrats et conventions",
      "Résolution des litiges",
    ],
  },
  {
    title: "Département Financier",
    icon: Wallet,
    description: "Gestion des ressources financières et comptabilité de la Fédération.",
    responsibilities: [
      "Gestion budgétaire",
      "Comptabilité",
      "Recherche de financement",
      "Rapports financiers",
    ],
  },
];

const committees = [
  {
    title: "Commission Éthique et Discipline",
    icon: UserCog,
    description: "Veille au respect du code de déontologie et traite les questions disciplinaires.",
  },
  {
    title: "Commission des Affaires Culturelles",
    icon: Film,
    description: "Organisation d'événements culturels et promotion du patrimoine cinématographique.",
  },
  {
    title: "Commission des Relations Internationales",
    icon: Building2,
    description: "Développement des partenariats internationaux et représentation à l'étranger.",
  },
  {
    title: "Commission Documentation et Archives",
    icon: FileText,
    description: "Conservation et valorisation du patrimoine audiovisuel ivoirien.",
  },
];

export default function OrganigrammePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-cinema">
      <FederationNav />

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          >
            <Link href="/federation" className="hover:text-foreground transition-colors">
              La Fédération
            </Link>
            <ArrowRight size={14} />
            <span className="text-foreground">Organigramme</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-px bg-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Structure Organisationnelle
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
              Organigramme
              <span className="block text-xl sm:text-2xl font-light text-muted-foreground mt-2">
                Notre structure organisationnelle
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Découvrez l&apos;organisation de la FICAV, de ses instances dirigeantes 
              à ses départements opérationnels, en passant par ses commissions spécialisées.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Organizational Hierarchy */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
              Instances Dirigeantes
            </h2>
          </motion.div>

          <div className="space-y-6">
            {organizationalStructure.map((org, index) => (
              <motion.div
                key={org.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 glow-orange"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <org.icon size={32} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-medium mb-2">
                      {org.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {org.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connection Lines */}
          <div className="relative my-8">
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-primary to-primary/30" />
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
              Départements Opérationnels
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Six départements spécialisés au service du développement du cinéma ivoirien.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <dept.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-medium">
                    {dept.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {dept.description}
                </p>
                <ul className="space-y-2">
                  {dept.responsibilities.map((resp, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Committees Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
              Commissions Spécialisées
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Des commissions thématiques pour des actions ciblées et efficaces.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {committees.map((committee, index) => (
              <motion.div
                key={committee.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <committee.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium mb-2">
                      {committee.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {committee.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-12 text-center"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
              Rencontrez notre équipe dirigeante
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Découvrez les membres du Bureau Fédéral qui portent la vision de la FICAV.
            </p>
            <Link
              href="/federation/bureau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Bureau Fédéral
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link
              href="/federation/mission"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-xs text-muted-foreground">Précédent</p>
                  <p className="font-serif text-lg font-medium">Mission et Vision</p>
                </div>
              </div>
            </Link>
            <Link
              href="/federation/bureau"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Suivant</p>
                  <p className="font-serif text-lg font-medium">Bureau Fédéral</p>
                </div>
                <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <FederationFooter />
    </div>
  );
}
