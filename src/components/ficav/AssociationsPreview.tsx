"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Association {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  category?: string;
}

// Default associations for SSR
const defaultAssociations: Association[] = [
  { id: "1", slug: "arp", name: "ARP", category: "Réalisation" },
  { id: "2", slug: "apci", name: "APCI", category: "Production" },
  { id: "3", slug: "aact", name: "AACT", category: "Interprétation" },
  { id: "4", slug: "atci", name: "ATCI", category: "Technique" },
];

export function AssociationsPreview() {
  const [associations, setAssociations] = useState<Association[]>(defaultAssociations);
  const hydratedRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    hydratedRef.current = true;
    fetch("/api/associations")
      .then((res) => res.json())
      .then((data) => {
        if (data.associations && data.associations.length > 0) {
          setAssociations(data.associations);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Associations membres
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les organisations qui composent notre fédération et représentent les métiers du cinéma
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {associations.map((association, index) => (
            <motion.div
              key={association.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={`/associations/${association.slug}`}
                className="block group"
              >
                <div className="glass-card rounded-xl p-6 text-center hover:glow-orange transition-shadow duration-300 h-full">
                  {/* Logo or Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {association.logo ? (
                      <img
                        src={association.logo}
                        alt={association.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  
                  {/* Name */}
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {association.name}
                  </h3>
                  
                  {/* Category */}
                  {association.category && (
                    <p className="text-xs text-muted-foreground">
                      {association.category}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/associations"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Voir toutes les associations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
