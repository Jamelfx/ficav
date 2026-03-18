"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";

type FederationSettings = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  heroImageUrl?: string | null;
  primaryColor?: string;
};

export function HeroSection() {
  const [settings, setSettings] = useState<FederationSettings>({
    heroTitle: "Fédération Ivoirienne du Cinéma et de l'Audiovisuel",
    heroSubtitle: "Le rendez-vous du cinéma ivoirien",
    heroDescription: "FICAV regroupe les associations de professionnels du cinéma et de l'audiovisuel en Côte d'Ivoire.",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/federation/settings");
        const data = await response.json();
        if (data && !data.error) {
          setSettings({
            heroTitle: data.heroTitle || settings.heroTitle,
            heroSubtitle: data.heroSubtitle || settings.heroSubtitle,
            heroDescription: data.heroDescription || settings.heroDescription,
            heroImageUrl: data.heroImageUrl,
            primaryColor: data.primaryColor,
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleExplorerClick = () => {
    // Scroll to the statistics section
    const statsSection = document.querySelector("#stats-section");
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBecomeMember = () => {
    // Dispatch an event to open the register dialog in UserMenu
    window.dispatchEvent(new CustomEvent("openRegister"));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, oklch(0.70 0.18 45 / 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, oklch(1.70 0.18 45 / 0.1) 0%, transparent 50%)`
          }} />
        </div>
        
        {/* Film strip decoration */}
        <div className="absolute top-20 left-0 right-0 h-3 film-strip opacity-30" />
        <div className="absolute bottom-20 left-0 right-0 h-3 film-strip opacity-30" />

        {/* Hero Background Image */}
        {settings.heroImageUrl && (
          <div className="absolute inset-0">
            <Image
              src={settings.heroImageUrl}
              alt="FICAV Background"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Main Title */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-wider"
            >
              <span className="text-primary">FICAV</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
              {settings.heroTitle}
            </motion.p>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="inline-flex items-center gap-3 glass rounded-full px-6 py-3"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm sm:text-base font-medium text-foreground">
              {settings.heroSubtitle}
            </span>
          </motion.div>

          {/* Description */}
          {settings.heroDescription && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {settings.heroDescription}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              onClick={handleExplorerClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange-strong text-base px-8 py-6 group"
            >
              <Play className="w-5 h-5 mr-2" />
              Explorer
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleBecomeMember}
              className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 text-base px-8 py-6"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Devenir Membre
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - positioned at the very bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-8 w-32 h-32 border border-primary/10 rounded-full opacity-50" />
      <div className="absolute bottom-1/4 right-8 w-48 h-48 border border-primary/10 rounded-full opacity-30" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-primary/5 rounded-full opacity-40" />
    </section>
  );
}
