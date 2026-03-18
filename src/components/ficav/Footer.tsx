"use client";

import Link from "next/link";
import { Clapperboard, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  federation: {
    title: "La Fédération",
    links: [
      { name: "Présentation", href: "/federation" },
      { name: "Histoire", href: "/federation/histoire" },
      { name: "Notre Mission", href: "/federation/mission" },
      { name: "Bureau Fédéral", href: "/federation/bureau" },
      { name: "Statuts", href: "/federation/statuts" },
    ],
  },
  ecosystem: {
    title: "Écosystème",
    links: [
      { name: "Films", href: "/films" },
      { name: "Associations", href: "/associations" },
      { name: "Statistiques", href: "/statistiques" },
    ],
  },
  services: {
    title: "Services",
    links: [
      { name: "Agenda", href: "/agenda" },
      { name: "Offres d'emploi", href: "/offres" },
      { name: "Cotisations", href: "/cotisations" },
      { name: "Documents", href: "/documents" },
      { name: "Galerie médias", href: "/medias" },
      { name: "Espace presse", href: "/presse" },
    ],
  },
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "YouTube", href: "#", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-gradient-cinema border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <Clapperboard className="w-8 h-8 text-primary" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground font-display tracking-widest">FICAV</span>
                  <span className="text-xs text-muted-foreground">
                    Fédération Ivoirienne du Cinéma et de l'Audiovisuel
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                Le hub digital du cinéma ivoirien. Nous connectons, représentons et 
                développons l'écosystème cinématographique et audiovisuel de Côte d'Ivoire.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Plateau, Abidjan, Côte d'Ivoire</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>+225 27 22 XX XX XX</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>contact@ficav.ci</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {Object.values(footerLinks).map((section) => (
                  <div key={section.title}>
                    <h3 className="text-base font-semibold text-foreground mb-4 font-display tracking-wider">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FICAV. Tous droits réservés.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/mentions-legales"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                href="/confidentialite"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
