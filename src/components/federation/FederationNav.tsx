"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X, Film } from "lucide-react";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/federation", label: "La Fédération" },
  { href: "/galleries", label: "Galeries" },
  { href: "/journal", label: "Journal" },
];

const federationSubItems = [
  { href: "/federation/histoire", label: "Histoire" },
  { href: "/federation/mission", label: "Mission et Vision" },
  { href: "/federation/organigramme", label: "Organigramme" },
  { href: "/federation/bureau", label: "Bureau Fédéral" },
  { href: "/federation/statuts", label: "Statuts et Règlements" },
];

export function FederationNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showFederationMenu, setShowFederationMenu] = useState(false);

  const isFederationPage = pathname.startsWith("/federation");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-4"
    >
      <nav className="glass rounded-2xl px-6 py-3 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2"
            >
              <Film className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                FICAV
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.href === "/federation" 
                ? isFederationPage 
                : pathname === item.href;
              
              if (item.href === "/federation") {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setShowFederationMenu(true)}
                    onMouseLeave={() => setShowFederationMenu(false)}
                  >
                    <Link
                      href={item.href}
                      className={`film-tab px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {showFederationMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 glass rounded-xl p-2 shadow-xl"
                      >
                        {federationSubItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                              pathname === subItem.href
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`film-tab px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 pt-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = item.href === "/federation" 
                  ? isFederationPage 
                  : pathname === item.href;
                
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                    
                    {/* Federation Sub-items in Mobile */}
                    {item.href === "/federation" && isFederationPage && (
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        {federationSubItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                              pathname === subItem.href
                                ? "bg-secondary/50 text-foreground"
                                : "text-muted-foreground hover:bg-secondary/30"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
