"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Film, Calendar, Milestone } from "lucide-react";
import { FederationNav } from "@/components/federation/FederationNav";
import { FederationFooter } from "@/components/federation/FederationFooter";

const timeline = [
  {
    year: "1989",
    title: "Fondation de la FICAV",
    description: "Création de la Fédération Ivoirienne du Cinéma et de l'Audiovisuel par un groupe de professionnels passionnés, dans l'objectif de structurer et promouvoir le secteur cinématographique ivoirien.",
    milestone: true,
  },
  {
    year: "1992",
    title: "Premier Congrès National",
    description: "Organisation du premier congrès rassemblant tous les acteurs du cinéma ivoirien. Adoption des premiers statuts et élection du premier bureau fédéral.",
    milestone: true,
  },
  {
    year: "1995",
    title: "Programme de Formation",
    description: "Lancement du premier programme de formation continue pour les techniciens et artistes du cinéma. Partenariat avec des écoles de cinéma internationales.",
    milestone: false,
  },
  {
    year: "1998",
    title: "Festival du Cinéma Ivoirien",
    description: "Création du Festival du Cinéma Ivoirien, devenu un rendez-vous majeur pour la promotion des œuvres nationales et la découverte de nouveaux talents.",
    milestone: true,
  },
  {
    year: "2002",
    title: "Crise et Résilience",
    description: "Malgré les difficultés liées à la crise politique, la FICAV maintient ses activités et continue de soutenir ses membres à travers des programmes d'aide.",
    milestone: false,
  },
  {
    year: "2007",
    title: "Accord de Ouagadougou",
    description: "La FICAV joue un rôle clé dans la restructuration du secteur audiovisuel suite aux accords de paix, participant à la reconstruction du patrimoine cinématographique.",
    milestone: false,
  },
  {
    year: "2011",
    title: "Renouveau du Cinéma Ivoirien",
    description: "Nouvelle dynamique pour le cinéma ivoirien avec la réouverture des salles et le soutien à la production locale. La FICAV s'engage dans la défense des intérêts des professionnels.",
    milestone: true,
  },
  {
    year: "2015",
    title: "Numérisation du Secteur",
    description: "Accompagnement des professionnels dans la transition numérique. Formation aux nouvelles technologies et modernisation des équipements.",
    milestone: false,
  },
  {
    year: "2018",
    title: "30ème Anniversaire",
    description: "Célébration des 30 ans de la FICAV avec un bilan des réalisations et une vision prospective pour les décennies à venir. Organisation d'événements mémorables.",
    milestone: true,
  },
  {
    year: "2020",
    title: "Adaptation à la Pandémie",
    description: "Mise en place de plateformes numériques et de programmes de soutien aux professionnels impactés par la crise sanitaire. Développement du streaming local.",
    milestone: false,
  },
  {
    year: "2023",
    title: "Nouvelle Stratégie Digitale",
    description: "Lancement de la plateforme numérique FICAV Connect et développement de partenariats internationaux pour la promotion du cinéma ivoirien à l'étranger.",
    milestone: true,
  },
  {
    year: "2024",
    title: "Vision 2030",
    description: "Adoption du plan stratégique Vision 2030 avec des objectifs ambitieux pour faire de la Côte d'Ivoire un hub du cinéma africain.",
    milestone: false,
  },
];

const historicalFacts = [
  {
    icon: Film,
    value: "150+",
    label: "Films produits avec soutien FICAV",
  },
  {
    icon: Calendar,
    value: "25",
    label: "Éditions du Festival",
  },
  {
    icon: Milestone,
    value: "35+",
    label: "Années d'existence",
  },
];

export default function HistoirePage() {
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
            <span className="text-foreground">Notre Histoire</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-px bg-primary" />
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Depuis 1989
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
                Notre Histoire
                <span className="block text-xl sm:text-2xl font-light text-muted-foreground mt-2">
                  Plus de trois décennies au service du cinéma ivoirien
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed mb-6">
                Découvrez le parcours remarquable de la FICAV, de sa fondation en 1989 
                jusqu&apos;à devenir l&apos;organisation de référence pour le cinéma et 
                l&apos;audiovisuel en Côte d&apos;Ivoire.
              </p>

              <div className="flex items-center gap-6">
                {historicalFacts.map((fact, index) => (
                  <motion.div
                    key={fact.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <fact.icon size={20} className="text-primary mx-auto mb-1" />
                    <p className="font-serif text-xl font-medium">{fact.value}</p>
                    <p className="text-xs text-muted-foreground">{fact.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card">
                <Image
                  src="/images/federation/histoire-hero.png"
                  alt="Histoire de la FICAV - Archives cinématographiques"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              {/* Decorative Film Strip */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 film-strip h-3 w-3/4 rounded opacity-50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
              Chronologie
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Les moments clés qui ont façonné l&apos;histoire de la FICAV et du cinéma ivoirien.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start gap-6 mb-8 sm:mb-12 ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10">
                  <div
                    className={`w-4 h-4 rounded-full border-4 border-background ${
                      item.milestone
                        ? "bg-primary glow-orange"
                        : "bg-muted"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className={`flex-1 pl-12 sm:pl-0 ${index % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                  <div
                    className={`glass-card rounded-xl p-6 ${
                      item.milestone ? "glow-orange" : ""
                    }`}
                  >
                    <span className="inline-block font-mono text-sm text-primary mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-serif text-lg font-medium mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden sm:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-12 text-center"
          >
            <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed mb-6">
              &quot;Le cinéma ivoirien est le miroir de notre identité, le gardien de notre mémoire 
              et le témoin de nos rêves.&quot;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Film size={18} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Fondateur FICAV</p>
                <p className="text-xs text-muted-foreground">1989</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link
              href="/federation"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-xs text-muted-foreground">Précédent</p>
                  <p className="font-serif text-lg font-medium">La Fédération</p>
                </div>
              </div>
            </Link>
            <Link
              href="/federation/mission"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Suivant</p>
                  <p className="font-serif text-lg font-medium">Mission et Vision</p>
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
