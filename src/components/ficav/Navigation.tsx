"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Clapperboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/ficav/UserMenu";
import { useAuth, COTISATION_MANAGERS, UserRole } from "../../lib/auth-context";

interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string; roles?: UserRole[] }[];
  roles?: UserRole[];
}

const baseNavigation: NavItem[] = [
  { name: "Accueil", href: "/" },
  {
    name: "La Fédération",
    href: "/federation",
    children: [
      { name: "Présentation", href: "/federation" },
      { name: "Histoire", href: "/federation/histoire" },
      { name: "Notre Mission", href: "/federation/mission" },
      { name: "Bureau Fédéral", href: "/federation/bureau" },
      { name: "Statuts", href: "/federation/statuts" },
    ],
  },
  {
    name: "Écosystème",
    href: "/films",
    children: [
      { name: "🎬 Films", href: "/films" },
      { name: "🤝 Associations", href: "/associations" },
      { name: "📊 Statistiques", href: "/statistiques" },
    ],
  },
  {
    name: "Services",
    href: "/agenda",
    children: [
      { name: "📅 Agenda", href: "/agenda" },
      { name: "💼 Offres d'emploi", href: "/offres" },
      { name: "💳 Cotisations", href: "/cotisations", roles: COTISATION_MANAGERS },
      { name: "📁 Documents", href: "/documents" },
      { name: "📸 Galerie médias", href: "/medias" },
      { name: "📰 Espace presse", href: "/presse" },
    ],
  },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  // Filter navigation based on user role
  const navigation = useMemo(() => {
    return baseNavigation.map(item => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            // If no roles specified, item is visible to all
            if (!child.roles) return true;
            // If user is not logged in, hide restricted items
            if (!user) return false;
            // Show if user has one of the required roles
            return child.roles.includes(user.role);
          }),
        };
      }
      return item;
    });
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Clapperboard className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-widest text-foreground font-display">FICAV</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest hidden sm:block">
                Cinéma Ivoirien
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.children && item.children.length > 0 ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 text-foreground/80 hover:text-foreground hover:bg-white/5 px-3"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="glass-card border-border/50 min-w-[180px]"
                  >
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link
                          href={child.href}
                          className="cursor-pointer hover:text-primary"
                        >
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors px-3 py-2 text-sm font-medium hover:bg-white/5 rounded-lg"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-foreground/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden glass-card border-t border-border/50"
          >
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <div className="pl-8 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-border/50">
                <UserMenu />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
