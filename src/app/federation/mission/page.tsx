"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Lightbulb,
  Globe,
  Clapperboard,
  GraduationCap,
  Shield,
  CheckCircle
} from "lucide-react";
import { FederationNav } from "@/components/federation/FederationNav";
import { FederationFooter } from "@/components/federation/FederationFooter";

const coreValues = [
  {
    icon: Heart,
    title: "Passion",
    description: "Un amour inconditionnel pour l'art cinématographique et audiovisuel qui anime chacune de nos actions.",
  },
  {
    icon: Users,
    title: "Solidarité",
    description: "L'union et l'entraide entre tous les acteurs du secteur pour construire ensemble l'avenir du cinéma ivoirien.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "La recherche constante de la qualité et du professionnalisme dans tous nos projets et initiatives.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "L'adaptation aux nouvelles technologies et la création de solutions innovantes pour le développement du secteur.",
  },
  {
    icon: Shield,
    title: "Intégrité",
    description: "La transparence, l'éthique et la gouvernance responsable au service de nos membres.",
  },
  {
    icon: Globe,
    title: "Ouverture",
    description: "L'ouverture sur le monde et la promotion du cinéma ivoirien à l'international.",
  },
];

const objectives = [
  "Représenter et défendre les intérêts des professionnels du cinéma et de l'audiovisuel ivoirien",
  "Promouvoir la production, la distribution et la diffusion des œuvres cinématographiques nationales",
  "Accompagner la formation continue et le perfectionnement des acteurs du secteur",
  "Favoriser les échanges et les coopérations avec les organisations cinématographiques internationales",
  "Contribuer au développement de l'industrie cinématographique ivoirienne",
  "Sensibiliser le public à la culture cinématographique et audiovisuelle",
];

const strategicAxes = [
  {
    icon: Clapperboard,
    title: "Production",
    description: "Soutien à la création et à la production de films ivoiriens de qualité",
  },
  {
    icon: GraduationCap,
    title: "Formation",
    description: "Développement des compétences et professionnalisation du secteur",
  },
  {
    icon: Globe,
    title: "Internationalisation",
    description: "Promotion du cinéma ivoirien sur la scène internationale",
  },
  {
    icon: Shield,
    title: "Défense des droits",
    description: "Protection des droits des auteurs et des professionnels",
  },
];

export default function MissionPage() {
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
            <span className="text-foreground">Mission et Vision</span>
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
                Notre raison d'être
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
              Mission et Vision
              <span className="block text-xl sm:text-2xl font-light text-muted-foreground mt-2">
                Construire l'avenir du cinéma ivoirien
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-12 glow-orange"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target size={28} className="text-primary" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium">
                Notre Mission
              </h2>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              La FICAV a pour mission de fédérer, représenter et défendre les intérêts 
              de tous les professionnels du cinéma et de l&apos;audiovisuel en Côte d&apos;Ivoire, 
              tout en promouvant le développement et le rayonnement de l&apos;industrie 
              cinématographique ivoirienne.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {objectives.map((objective, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">{objective}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Eye size={28} className="text-primary" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium">
                Notre Vision
              </h2>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              D&apos;ici 2030, nous envisageons de faire de la Côte d&apos;Ivoire un hub 
              incontournable du cinéma africain, reconnu internationalement pour 
              la qualité de ses productions, le professionnalisme de ses talents 
              et la vitalité de son industrie audiovisuelle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {strategicAxes.map((axis, index) => (
                <motion.div
                  key={axis.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <axis.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-2">
                    {axis.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {axis.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
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
              Nos Valeurs Fondamentales
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Des principes qui guident notre action quotidienne au service du cinéma ivoirien.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="glass-card rounded-xl p-6 h-full hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <value.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-12 text-center"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-6">
              Notre Engagement
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              La FICAV s&apos;engage à créer un environnement propice à l&apos;épanouissement 
              des talents, à la production d&apos;œuvres de qualité et au développement 
              durable de l&apos;industrie cinématographique ivoirienne.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/federation/bureau"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Notre équipe
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/federation/statuts"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium text-sm hover:bg-secondary/50 transition-colors"
              >
                Statuts et Règlements
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
              href="/federation/histoire"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-xs text-muted-foreground">Précédent</p>
                  <p className="font-serif text-lg font-medium">Notre Histoire</p>
                </div>
              </div>
            </Link>
            <Link
              href="/federation/organigramme"
              className="group glass-card rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Suivant</p>
                  <p className="font-serif text-lg font-medium">Organigramme</p>
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
