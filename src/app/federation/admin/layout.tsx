"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Radio,
  Globe,
  LogOut,
  ChevronRight,
  Receipt,
  IdCard,
  Bell,
  Briefcase,
} from "lucide-react";
import { useAuth, FEDERATION_STAFF_ROLES } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    name: "Tableau de bord",
    href: "/federation/admin",
    icon: LayoutDashboard,
    roles: FEDERATION_STAFF_ROLES,
  },
  {
    name: "Candidatures",
    href: "/federation/admin/applications",
    icon: Users,
    roles: ["SECRETAIRE_GENERAL", "PRESIDENT"] as const,
  },
  {
    name: "Invitations",
    href: "/federation/admin/invitations",
    icon: Users,
    roles: ["SECRETAIRE_GENERAL", "PRESIDENT"] as const,
  },
  {
    name: "Cotisations",
    href: "/federation/admin/cotisations",
    icon: CreditCard,
    roles: ["TRESORIERE", "PRESIDENT"] as const,
  },
  {
    name: "Dépenses",
    href: "/federation/admin/depenses",
    icon: Receipt,
    roles: ["TRESORIERE", "PRESIDENT"] as const,
  },
  {
    name: "Réunions",
    href: "/federation/admin/meetings",
    icon: Calendar,
    roles: ["PRESIDENT", "SECRETAIRE_GENERAL"] as const,
  },
  {
    name: "Mon Profil",
    href: "/federation/admin/profile",
    icon: Users,
    roles: FEDERATION_STAFF_ROLES,
  },
  {
    name: "Notifications",
    href: "/federation/admin/notifications",
    icon: Bell,
    roles: ["DIRECTEUR_COMMUNICATION"] as const,
  },
  {
    name: "Offres à valider",
    href: "/federation/admin/job-offers",
    icon: Briefcase,
    roles: ["DIRECTEUR_COMMUNICATION"] as const,
  },
  {
    name: "Cartes d'accès",
    href: "/federation/admin/access-cards",
    icon: IdCard,
    roles: ["DIRECTEUR_COMMUNICATION"] as const,
  },
  {
    name: "Livestreams",
    href: "/federation/admin/livestreams",
    icon: Radio,
    roles: ["DIRECTEUR_COMMUNICATION"] as const,
  },
  {
    name: "Site Web",
    href: "/federation/admin/website",
    icon: Globe,
    roles: ["DIRECTEUR_COMMUNICATION"] as const,
  },
];

export default function FederationAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isFederationStaff, isHydrated } = useAuth();
  const [logoUrl, setLogoUrl] = useState("/images/logo-ficav-official.png");

  // Fetch logo from settings
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/federation/settings");
        const data = await response.json();
        if (data?.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  // Redirect if not federation staff - only after hydration is complete
  useEffect(() => {
    // Wait for hydration to complete before checking auth state
    if (!isHydrated) return;

    // If hydrated and no user, redirect to home
    if (!user) {
      router.push("/");
      return;
    }

    // If user exists but is not federation staff, redirect to association dashboard
    if (user && !isFederationStaff) {
      router.push("/dashboard");
    }
  }, [user, isFederationStaff, isHydrated, router]);

  // Show loading during hydration or while checking auth
  if (!isHydrated || !user || !isFederationStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </div>
    );
  }

  // Filter sidebar items based on user role
  const visibleItems = sidebarItems.filter(
    (item) => item.roles.includes(user.role as typeof item.roles[number])
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "PRESIDENT":
        return "Président";
      case "SECRETAIRE_GENERAL":
        return "Secrétaire Général";
      case "TRESORIERE":
        return "Trésorière";
      case "DIRECTEUR_COMMUNICATION":
        return "Directeur de la Communication";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src={logoUrl}
                  alt="FICAV Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold tracking-widest text-foreground font-display">
                  FICAV
                </span>
                <p className="text-xs text-muted-foreground">Administration</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-primary">{getRoleLabel(user.role)}</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
