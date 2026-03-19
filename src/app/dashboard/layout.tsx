"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Film,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Clapperboard,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, FEDERATION_STAFF_ROLES } from "@/lib/auth-context";

const sidebarLinks = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vue d'ensemble",
  },
  {
    name: "Mon Association",
    href: "/dashboard/association",
    icon: Building2,
    description: "Profil et informations",
  },
  {
    name: "Membres",
    href: "/dashboard/membres",
    icon: Users,
    description: "Gestion des membres",
  },
  {
    name: "Films",
    href: "/dashboard/films",
    icon: Film,
    description: "Catalogue de films",
  },
  {
    name: "Événements",
    href: "/dashboard/evenements",
    icon: Calendar,
    description: "Gestion des événements",
  },
  {
    name: "Cotisations",
    href: "/dashboard/cotisations",
    icon: CreditCard,
    description: "Adhésion et cotisations",
  },
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    description: "Bibliothèque documents",
  },
  {
    name: "Paramètres",
    href: "/dashboard/parametres",
    icon: Settings,
    description: "Configuration du compte",
  },
];

// Sidebar links for association members

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout, isFederationStaff } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if not authenticated - only after hydration is complete
  useEffect(() => {
    // Wait for hydration to complete before checking auth state
    if (!isHydrated) return;

    // If hydrated and no user, redirect to home
    if (!user) {
      router.push("/");
      return;
    }

    // If user is federation staff, redirect to federation admin
    if (user && isFederationStaff) {
      router.push("/federation/admin");
    }
  }, [user, isFederationStaff, isHydrated, router]);

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Show loading during hydration or while checking auth
  if (!isHydrated || !isAuthenticated || !user || isFederationStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cinema">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </div>
    );
  }

  // Get user association info
  const userAssociation = {
    name: user.associationName || "Mon Association",
    shortName: user.associationShortName || "ASSO",
    logo: "/images/associations/default.png",
    memberCount: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-cinema">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-white/5 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Clapperboard className="w-6 h-6 text-primary" />
            <span className="font-display text-xl tracking-widest">FICAV</span>
          </Link>
          <Avatar className="w-8 h-8">
            <AvatarImage src={userAssociation.logo} alt={userAssociation.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userAssociation.shortName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 glass-card z-50 p-4"
            >
              <MobileSidebarContent
                pathname={pathname}
                onClose={() => setMobileMenuOpen(false)}
                association={userAssociation}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        <div className="glass-card h-full m-2 rounded-2xl flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-border/30">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clapperboard className="w-6 h-6 text-primary" />
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col"
                >
                  <span className="font-display text-xl tracking-widest text-foreground">FICAV</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Espace Membre
                  </span>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Association Info */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-b border-border/30"
            >
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-primary/30">
                    <AvatarImage src={userAssociation.logo} alt={userAssociation.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {userAssociation.shortName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {userAssociation.shortName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userAssociation.memberCount} membres
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || 
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`} />
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 min-w-0"
                    >
                      <span className="text-sm font-medium">{link.name}</span>
                    </motion.div>
                  )}
                  {sidebarOpen && isActive && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Toggle Button */}
          <div className="p-3 border-t border-border/30">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-colors"
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </motion.div>
              {sidebarOpen && <span className="text-sm">Réduire</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 lg:pt-0 ${
          sidebarOpen ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
        {/* Top Bar */}
        <header className="hidden lg:flex items-center justify-between px-6 py-4 glass border-b border-border/30">
          <div>
            <h1 className="font-display text-2xl tracking-wider text-foreground">
              {sidebarLinks.find(l => l.href === pathname)?.name || "Tableau de bord"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Bienvenue, {userAssociation.name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 glass-card">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <span className="text-sm font-medium">Nouveau membre inscrit</span>
                    <span className="text-xs text-muted-foreground">Il y a 2 heures</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <span className="text-sm font-medium">Cotisation reçue</span>
                    <span className="text-xs text-muted-foreground">Hier</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <span className="text-sm font-medium">Rappel: Assemblée générale</span>
                    <span className="text-xs text-muted-foreground">Il y a 3 jours</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userAssociation.logo} alt={userAssociation.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {userAssociation.shortName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userAssociation.shortName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/association">Profil association</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/parametres">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Mobile Sidebar Content Component
function MobileSidebarContent({
  pathname,
  onClose,
  association,
  onLogout,
}: {
  pathname: string;
  onClose: () => void;
  association: { name: string; shortName: string; logo: string; memberCount: number };
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2">
          <Clapperboard className="w-6 h-6 text-primary" />
          <span className="font-display text-xl tracking-widest">FICAV</span>
        </Link>
      </div>

      {/* Association Info */}
      <div className="glass rounded-xl p-3 mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-primary/30">
            <AvatarImage src={association.logo} alt={association.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {association.shortName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {association.shortName}
            </p>
            <p className="text-xs text-muted-foreground">
              {association.memberCount} membres
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || 
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-border/30">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
