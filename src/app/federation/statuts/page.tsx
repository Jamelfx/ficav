"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Download, 
  BookOpen,
  Scale,
  Users,
  Shield,
  ClipboardList,
  Building2,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { FederationNav } from "@/components/federation/FederationNav";
import { FederationFooter } from "@/components/federation/FederationFooter";

const documents = [
  {
    title: "Statuts de la FICAV",
    description: "Document fondateur définissant l'organisation, les objectifs et le fonctionnement de la Fédération.",
    icon: Scale,
    type: "PDF",
    size: "2.4 MB",
    lastUpdated: "Janvier 2024",
    downloadUrl: "#",
  },
  {
    title: "Règlement Intérieur",
    description: "Règles de fonctionnement interne et modalités d'application des statuts.",
    icon: ClipboardList,
    type: "PDF",
    size: "1.8 MB",
    lastUpdated: "Mars 2024",
    downloadUrl: "#",
  },
  {
    title: "Code de Déontologie",
    description: "Charte éthique et règles de conduite pour tous les membres de la Fédération.",
    icon: Shield,
    type: "PDF",
    size: "1.2 MB",
    lastUpdated: "Février 2024",
    downloadUrl: "#",
  },
  {
    title: "Guide du Membre",
    description: "Manuel d'information pour les nouveaux membres de la FICAV.",
    icon: BookOpen,
    type: "PDF",
    size: "3.5 MB",
    lastUpdated: "Avril 2024",
    downloadUrl: "#",
  },
];

const keyArticles = [
  {
    chapter: "Titre I",
    title: "Constitution et Objet",
    articles: [
      {
        number: "Article 1",
        title: "Dénomination",
        content: "Il est fondé entre les adhérents aux présents statuts une association dénommée \"Fédération Ivoirienne du Cinéma et de l'Audiovisuel\" (FICAV).",
      },
      {
        number: "Article 2",
        title: "Siège Social",
        content: "Le siège social est fixé à Abidjan, Côte d'Ivoire. Il peut être transféré en tout autre lieu par décision du Bureau Fédéral.",
      },
      {
        number: "Article 3",
        title: "Objet",
        content: "La FICAV a pour objet de fédérer, représenter et défendre les intérêts des professionnels du cinéma et de l'audiovisuel ivoirien.",
      },
    ],
  },
  {
    chapter: "Titre II",
    title: "Membres",
    articles: [
      {
        number: "Article 4",
        title: "Catégories de membres",
        content: "La Fédération comprend des membres actifs, des membres associés et des membres d'honneur. Seuls les membres actifs ont le droit de vote.",
      },
      {
        number: "Article 5",
        title: "Conditions d'adhésion",
        content: "Pour être membre actif, il faut être professionnel du cinéma ou de l'audiovisuel, exercer une activité dans le secteur et s'acquitter de la cotisation annuelle.",
      },
      {
        number: "Article 6",
        title: "Droits et obligations",
        content: "Les membres bénéficient des services de la Fédération et s'engagent à respecter les statuts, le règlement intérieur et le code de déontologie.",
      },
    ],
  },
  {
    chapter: "Titre III",
    title: "Organisation",
    articles: [
      {
        number: "Article 7",
        title: "Assemblée Générale",
        content: "L'Assemblée Générale est l'organe suprême de la Fédération. Elle comprend tous les membres actifs et se réunit au moins une fois par an.",
      },
      {
        number: "Article 8",
        title: "Bureau Fédéral",
        content: "Le Bureau Fédéral est l'organe exécutif. Il est composé d'un Président, de Vice-Présidents, d'un Secrétaire Général et d'un Trésorier.",
      },
      {
        number: "Article 9",
        title: "Élections",
        content: "Les membres du Bureau Fédéral sont élus pour un mandat de quatre ans renouvelable une fois par l'Assemblée Générale.",
      },
    ],
  },
];

const governancePrinciples = [
  {
    icon: Users,
    title: "Démocratie",
    description: "Élection des dirigeants et participation des membres aux décisions importantes",
  },
  {
    icon: Shield,
    title: "Transparence",
    description: "Compte-rendu régulier des activités et publication des rapports financiers",
  },
  {
    icon: Building2,
    title: "Gouvernance",
    description: "Séparation des pouvoirs et contrôle interne des décisions",
  },
  {
    icon: Scale,
    title: "Équité",
    description: "Traitement équitable de tous les membres et respect de la diversité",
  },
];

export default function StatutsPage() {
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
            <span className="text-foreground">Statuts et Règlements</span>
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
                Cadre Juridique
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
              Statuts et Règlements
              <span className="block text-xl sm:text-2xl font-light text-muted-foreground mt-2">
                Le cadre juridique de la Fédération
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Consultez les documents fondateurs et réglementaires qui régissent 
              le fonctionnement de la FICAV.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
              Documents Officiels
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Téléchargez les documents essentiels de la Fédération.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <doc.icon size={28} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono px-2 py-0.5 bg-secondary rounded">
                        {doc.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {doc.size}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-medium mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {doc.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Mis à jour: {doc.lastUpdated}
                      </span>
                      <a
                        href={doc.downloadUrl}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Download size={14} />
                        Télécharger
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Articles Section */}
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
              Articles Clés des Statuts
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Extraits des principaux articles définissant l&apos;organisation de la FICAV.
            </p>
          </motion.div>

          <div className="space-y-8">
            {keyArticles.map((chapter, chapterIndex) => (
              <motion.div
                key={chapter.chapter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: chapterIndex * 0.1 }}
                className="glass-card rounded-xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {chapter.chapter}
                    </span>
                    <h3 className="font-serif text-xl font-medium">
                      {chapter.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {chapter.articles.map((article, articleIndex) => (
                    <div
                      key={article.number}
                      className="p-4 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-sm text-primary shrink-0 mt-0.5">
                          {article.number}
                        </span>
                        <div>
                          <h4 className="font-medium text-sm mb-1">
                            {article.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {article.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Principles */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-12"
          >
            <h2 className="font-serif text-2xl font-medium mb-8 text-center">
              Principes de Gouvernance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {governancePrinciples.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <principle.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Des questions sur nos statuts ?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Notre équipe juridique est disponible pour répondre à vos questions 
              sur le cadre réglementaire de la FICAV.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/federation/bureau"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Contactez-nous
                <ExternalLink size={16} />
              </Link>
              <Link
                href="/federation"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium text-sm hover:bg-secondary/50 transition-colors"
              >
                Retour à la Fédération
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link
              href="/federation/bureau"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-xs text-muted-foreground">Précédent</p>
                  <p className="font-serif text-lg font-medium">Bureau Fédéral</p>
                </div>
              </div>
            </Link>
            <Link
              href="/federation"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Retour</p>
                  <p className="font-serif text-lg font-medium">La Fédération</p>
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
