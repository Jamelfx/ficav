"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  Film, 
  Calendar, 
  Award, 
  Clock, 
  Target, 
  Heart,
  BookOpen,
  Building,
  UsersRound,
  Scale
} from "lucide-react";
import { FederationNav } from "@/components/federation/FederationNav";
import { FederationFooter } from "@/components/federation/FederationFooter";

const quickLinks = [
  {
    href: "/federation/histoire",
    title: "Notre Histoire",
    description: "Découvrez le parcours de la FICAV depuis sa création",
    icon: Clock,
  },
  {
    href: "/federation/mission",
    title: "Mission et Vision",
    description: "Nos objectifs et notre vision pour le cinéma ivoirien",
    icon: Target,
  },
  {
    href: "/federation/organigramme",
    title: "Organigramme",
    description: "Structure organisationnelle et départements",
    icon: Building,
  },
  {
    href: "/federation/bureau",
    title: "Bureau Fédéral",
    description: "Rencontrez notre équipe dirigeante",
    icon: UsersRound,
  },
  {
    href: "/federation/statuts",
    title: "Statuts et Règlements",
    description: "Documents juridiques et cadre réglementaire",
    icon: Scale,
  },
];

const stats = [
  { label: "Membres affiliés", value: "250+", icon: Users },
  { label: "Années d'existence", value: "35+", icon: Calendar },
  { label: "Films soutenus", value: "500+", icon: Film },
  { label: "Prix décernés", value: "120+", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "Un amour inconditionnel pour le cinéma et l'audiovisuel ivoirien"
  },
  {
    icon: Users,
    title: "Solidarité",
    description: "L'union et l'entraide entre tous les acteurs du secteur"
  },
  {
    icon: Award,
    title: "Excellence",
    description: "La recherche constante de la qualité et du professionnalisme"
  },
  {
    icon: BookOpen,
    title: "Formation",
    description: "Le développement des compétences et le transfert de savoir"
  },
];

export default function FederationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-cinema">
      <FederationNav />

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Title Group */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-primary" />
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  La Fédération
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] tracking-tight mb-6">
                FICAV
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-light text-muted-foreground mt-2">
                  Fédération Ivoirienne du Cinéma et de l&apos;Audiovisuel
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
                Acteur majeur du paysage cinématographique ivoirien, la FICAV fédère 
                et représente les professionnels du secteur depuis plus de trois décennies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/federation/histoire"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Découvrir notre histoire
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/federation/bureau"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium text-sm hover:bg-secondary/50 transition-colors"
                >
                  Notre équipe
                </Link>
              </div>
            </motion.div>

            {/* Right: Featured Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="relative lg:ml-8"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card">
                <Image
                  src="/images/federation/hero-federation.png"
                  alt="FICAV - Fédération Ivoirienne du Cinéma et de l'Audiovisuel"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 glow-orange"
              >
                <div className="flex items-center gap-3">
                  <Film size={20} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Depuis</p>
                    <p className="text-sm font-medium">1989</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 text-center"
              >
                <stat.icon size={24} className="text-primary mx-auto mb-3" />
                <p className="font-serif text-3xl sm:text-4xl font-medium mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
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
              Explorez la Fédération
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Découvrez tous les aspects de notre organisation et notre engagement 
              pour le développement du cinéma ivoirien.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="group block glass-card rounded-xl p-6 hover:shadow-lg transition-all h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <link.icon size={24} className="text-primary" />
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-12"
          >
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
                Nos Valeurs Fondamentales
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Des principes qui guident notre action quotidienne au service du cinéma ivoirien.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
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
            className="glass-card rounded-2xl p-8 sm:p-12 text-center glow-orange"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
              Rejoignez la FICAV
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Devenez membre de la fédération et participez au développement 
              du cinéma et de l&apos;audiovisuel ivoirien.
            </p>
            <Link
              href="/federation/statuts"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              En savoir plus
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <FederationFooter />
    </div>
  );
}
