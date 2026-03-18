"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Clapperboard } from "lucide-react";

export function PresidentMessage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-2xl p-8 sm:p-12 lg:p-16 relative"
        >
          {/* Quote Icon */}
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
            <Quote className="w-12 h-12 text-primary/20" />
          </div>

          <div className="flex flex-col items-center text-center">
            {/* President Photo Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mb-8"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-4 ring-primary/10">
                <Clapperboard className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 scale-110 animate-spin-slow" style={{ animationDuration: '20s' }} />
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed mb-8 font-serif italic"
            >
              "Le cinéma ivoirien est une voix qui s'élève, une histoire qui se raconte, 
              un avenir qui s'écrit. La FICAV est le gardien de cette flamme créative, 
              unissant les talents pour bâtir une industrie forte et rayonnante."
            </motion.blockquote>

            {/* Attribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4" />
              <p className="text-primary font-semibold">
                Président de la FICAV
              </p>
              <p className="text-sm text-muted-foreground">
                Fédération Ivoirienne du Cinéma et de l'Audiovisuel
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
