"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Linkedin,
  Award,
  Briefcase,
  Users
} from "lucide-react";
import { FederationNav } from "@/components/federation/FederationNav";
import { FederationFooter } from "@/components/federation/FederationFooter";

const leadershipTeam = [
  {
    name: "Dr. Kofi Konan",
    title: "Président",
    image: "/images/federation/president.png",
    bio: "Fondateur et président de la FICAV depuis 2015. Cinéaste et producteur reconnu avec plus de 30 ans d'expérience dans l'industrie audiovisuelle ivoirienne.",
    achievements: [
      "Plus de 25 films produits",
      "Prix du meilleur film FESPACO 2012",
      "Chevalier de l'Ordre du Mérite Culturel",
    ],
    contact: {
      email: "president@ficav.ci",
      linkedin: "#",
    },
  },
  {
    name: "Mme Aminata Diallo",
    title: "Vice-Présidente",
    image: "/images/federation/vp.png",
    bio: "Experte en production audiovisuelle et ancienne directrice de la télévision nationale. Elle apporte son expertise en gestion et stratégie à la FICAV.",
    achievements: [
      "20 ans d'expérience média",
      "Formatrice certifiée UNESCO",
      "Experte en régulation audiovisuelle",
    ],
    contact: {
      email: "vice-president@ficav.ci",
      linkedin: "#",
    },
  },
  {
    name: "M. Ibrahim Ouattara",
    title: "Secrétaire Général",
    image: "/images/federation/secretary.png",
    bio: "Juriste spécialisé en droit de l'audiovisuel, il assure la coordination administrative et juridique de la Fédération depuis 2018.",
    achievements: [
      "Docteur en droit",
      "Auteur de publications juridiques",
      "Consultant en propriété intellectuelle",
    ],
    contact: {
      email: "secretaire@ficav.ci",
      linkedin: "#",
    },
  },
  {
    name: "Mme Fatou Bamba",
    title: "Trésorière",
    image: "/images/federation/treasurer.png",
    bio: "Expert-comptable avec une spécialisation dans le secteur culturel. Elle gère les finances de la Fédération avec rigueur et transparence.",
    achievements: [
      "Expert-comptable certifié",
      "15 ans en gestion culturelle",
      "Auditrice de projets cinématographiques",
    ],
    contact: {
      email: "tresorier@ficav.ci",
      linkedin: "#",
    },
  },
];

const additionalMembers = [
  {
    name: "M. Jean-Baptiste Kouassi",
    title: "Secrétaire Adjoint",
    role: "Coordination des activités",
  },
  {
    name: "Mme Marie-Claire Yao",
    title: "Trésorière Adjointe",
    role: "Gestion budgétaire",
  },
  {
    name: "M. Sékou Touré",
    title: "Conseiller Technique",
    role: "Affaires internationales",
  },
  {
    name: "Mme Adama Sanogo",
    title: "Conseillère Communication",
    role: "Relations publiques",
  },
];

export default function BureauPage() {
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
            <span className="text-foreground">Bureau Fédéral</span>
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
                Notre Leadership
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
              Bureau Fédéral
              <span className="block text-xl sm:text-2xl font-light text-muted-foreground mt-2">
                L&apos;équipe dirigeante de la FICAV
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Des professionnels expérimentés et passionnés, engagés au service 
              du développement du cinéma et de l&apos;audiovisuel ivoirien.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Stats */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Users, value: "4", label: "Membres du Bureau" },
              { icon: Award, value: "80+", label: "Années d'expérience cumulée" },
              { icon: Briefcase, value: "100+", label: "Projets supervisés" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-4 sm:p-6 text-center"
              >
                <stat.icon size={20} className="text-primary mx-auto mb-2" />
                <p className="font-serif text-2xl sm:text-3xl font-medium">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Leadership Cards */}
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
              Membres du Bureau
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Des leaders expérimentés au service de la fédération.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {leadershipTeam.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto shrink-0">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 192px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent sm:bg-gradient-to-r" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full mb-2">
                          {member.title}
                        </span>
                        <h3 className="font-serif text-xl font-medium">
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {member.bio}
                    </p>

                    {/* Achievements */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Réalisations
                      </h4>
                      <ul className="space-y-1">
                        {member.achievements.map((achievement, i) => (
                          <li key={i} className="text-xs text-foreground/80 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${member.contact.email}`}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={18} />
                      </a>
                      <a
                        href={member.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        aria-label={`LinkedIn ${member.name}`}
                      >
                        <Linkedin size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Members */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-12"
          >
            <h2 className="font-serif text-2xl font-medium mb-6 text-center">
              Membres Associés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                    <span className="font-serif text-xl font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-medium mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-primary mb-1">{member.title}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
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
              Contactez notre Bureau
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Vous souhaitez entrer en contact avec l&apos;équipe dirigeante de la FICAV ?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:contact@ficav.ci"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <Mail size={16} />
                contact@ficav.ci
              </a>
              <a
                href="tel:+2252722000000"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium text-sm hover:bg-secondary/50 transition-colors"
              >
                <Phone size={16} />
                +225 27 22 XX XX XX
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link
              href="/federation/organigramme"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-xs text-muted-foreground">Précédent</p>
                  <p className="font-serif text-lg font-medium">Organigramme</p>
                </div>
              </div>
            </Link>
            <Link
              href="/federation/statuts"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Suivant</p>
                  <p className="font-serif text-lg font-medium">Statuts et Règlements</p>
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
