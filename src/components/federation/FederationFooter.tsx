"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

export function FederationFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/30 bg-gradient-to-t from-background to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-6 h-6 text-primary" />
                <span className="font-serif text-xl font-medium">FICAV</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fédération Ivoirienne du Cinéma et de l&apos;Audiovisuel. 
                Promouvoir et développer le secteur cinématographique ivoirien.
              </p>
            </motion.div>
          </div>

          {/* La Fédération */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                La Fédération
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/federation/histoire"
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Notre Histoire
                  </Link>
                </li>
                <li>
                  <Link
                    href="/federation/mission"
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Mission et Vision
                  </Link>
                </li>
                <li>
                  <Link
                    href="/federation/organigramme"
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Organigramme
                  </Link>
                </li>
                <li>
                  <Link
                    href="/federation/bureau"
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Bureau Fédéral
                  </Link>
                </li>
                <li>
                  <Link
                    href="/federation/statuts"
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Statuts et Règlements
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Contact */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">
                    Abidjan, Côte d&apos;Ivoire
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-primary shrink-0" />
                  <span className="text-sm text-foreground/80">
                    +225 27 22 XX XX XX
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-primary shrink-0" />
                  <span className="text-sm text-foreground/80">
                    contact@ficav.ci
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Social */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Suivez-nous
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © {currentYear} FICAV - Fédération Ivoirienne du Cinéma et de l&apos;Audiovisuel
          </p>
          <p className="text-xs text-muted-foreground">
            Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
