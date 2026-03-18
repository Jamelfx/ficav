"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Film, Camera, Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface Statistics {
  associations: number;
  films: number;
  technicians: number;
  productions: number;
  growth?: {
    associations: number;
    films: number;
    technicians: number;
    productions: number;
  };
}

// Default statistics for SSR
const defaultStats: Statistics = {
  associations: 12,
  films: 85,
  technicians: 1250,
  productions: 142,
  growth: {
    associations: 20,
    films: 15,
    technicians: 25,
    productions: 30,
  },
};

const statConfig = [
  {
    key: "associations" as const,
    label: "Associations membres",
    icon: Users,
    description: "Organisations professionnelles actives",
  },
  {
    key: "films" as const,
    label: "Films répertoriés",
    icon: Film,
    description: "Dans notre base de données",
  },
  {
    key: "technicians" as const,
    label: "Techniciens enregistrés",
    icon: Camera,
    description: "Professionnels certifiés",
  },
  {
    key: "productions" as const,
    label: "Productions annuelles",
    icon: Calendar,
    description: "Projets réalisés en 2024",
  },
];

function AnimatedCounter({ 
  target, 
  duration = 2000,
  startAnimation = false,
}: { 
  target: number; 
  duration?: number;
  startAnimation?: boolean;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef({ target, startTime: 0, animationFrame: 0 });

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * target));

      if (progress < 1) {
        countRef.current.animationFrame = requestAnimationFrame(animate);
      }
    };

    countRef.current.animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(countRef.current.animationFrame);
  }, [target, duration, startAnimation]);

  return (
    <span className="tabular-nums font-display text-4xl sm:text-5xl lg:text-6xl">
      {count.toLocaleString("fr-FR")}
    </span>
  );
}

export function StatsCounter() {
  const [stats, setStats] = useState<Statistics>(defaultStats);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/statistics")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStats({
            associations: data.totalAssociations || defaultStats.associations,
            films: data.totalFilms || defaultStats.films,
            technicians: data.totalTechnicians || defaultStats.technicians,
            productions: data.totalProductions || defaultStats.productions,
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section id="stats-section" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            L&apos;écosystème du cinéma ivoirien en chiffres
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une communauté dynamique et en pleine croissance
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statConfig.map((stat, index) => {
            const Icon = stat.icon;
            const value = stats[stat.key];
            const growthValue = stats.growth?.[stat.key] || 0;
            
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 sm:p-8 text-center group hover:glow-orange transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground mb-2">
                  <AnimatedCounter 
                    target={value} 
                    startAnimation={isInView}
                  />
                </div>
                
                <p className="text-sm sm:text-base text-muted-foreground mb-1">
                  {stat.label}
                </p>
                
                <p className="text-xs text-muted-foreground/70">
                  {stat.description}
                </p>
                
                {/* Growth indicator */}
                {growthValue > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-3 text-xs">
                    {growthValue > 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={growthValue > 0 ? "text-green-400" : "text-red-400"}>
                      +{growthValue}%
                    </span>
                    <span className="text-muted-foreground">cette année</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
