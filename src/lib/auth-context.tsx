"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// User roles matching Prisma schema
export type UserRole = 
  | "SUPER_ADMIN"
  | "PRESIDENT"
  | "SECRETAIRE_GENERAL"
  | "TRESORIERE"
  | "DIRECTEUR_COMMUNICATION"
  | "ADMIN_ASSOCIATION"
  | "PROFESSIONAL"
  | "VISITOR";

// Federation staff roles that have admin access
export const FEDERATION_STAFF_ROLES: UserRole[] = [
  "PRESIDENT",
  "SECRETAIRE_GENERAL", 
  "TRESORIERE",
  "DIRECTEUR_COMMUNICATION"
];

// Roles that can manage cotisations
export const COTISATION_MANAGERS: UserRole[] = [
  "PRESIDENT",
  "SECRETAIRE_GENERAL",
  "TRESORIERE",
  "DIRECTEUR_COMMUNICATION"
];

interface User {
  id: string;
  email: string;
  name: string;
  associationId?: string;
  associationName?: string;
  associationShortName?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isFederationStaff: boolean;
  canManageCotisations: boolean;
  canConvokeMeetings: boolean;
  canManageApplications: boolean;
  canManageWebsite: boolean;
  canManageFinances: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const mockUsers: User[] = [
  // Federation Staff
  {
    id: "federation-1",
    email: "president@ficav.ci",
    name: "Président FICAV",
    role: "PRESIDENT",
  },
  {
    id: "federation-2",
    email: "secretaire@ficav.ci",
    name: "Secrétaire Général",
    role: "SECRETAIRE_GENERAL",
  },
  {
    id: "federation-3",
    email: "tresoriere@ficav.ci",
    name: "Trésorière FICAV",
    role: "TRESORIERE",
  },
  {
    id: "federation-4",
    email: "communication@ficav.ci",
    name: "Directeur de la Communication",
    role: "DIRECTEUR_COMMUNICATION",
  },
  // Association Admins
  {
    id: "1",
    email: "aaci@ficav.ci",
    name: "AACI Admin",
    associationId: "1",
    associationName: "Association des Acteurs de Côte d'Ivoire",
    associationShortName: "AACI",
    role: "ADMIN_ASSOCIATION",
  },
  {
    id: "2",
    email: "arci@ficav.ci",
    name: "ARCI Admin",
    associationId: "2",
    associationName: "Association des Réalisateurs de Côte d'Ivoire",
    associationShortName: "ARCI",
    role: "ADMIN_ASSOCIATION",
  },
  {
    id: "3",
    email: "demo@ficav.ci",
    name: "Demo User",
    associationId: "1",
    associationName: "Association des Acteurs de Côte d'Ivoire",
    associationShortName: "AACI",
    role: "ADMIN_ASSOCIATION",
  },
];

const STORAGE_KEY = "ficav_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  
  // Always start with null to avoid hydration mismatch
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasHydrated = useRef(false);

  // Read from localStorage after hydration (client-side only)
  // Using a ref to prevent the ESLint warning about setState in useEffect
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    
    const hydrateUser = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          // Use functional update to avoid cascading renders warning
          setUser(() => parsed);
        }
      } catch {
        // Ignore errors
      }
      setIsHydrated(true);
    };
    
    // Small delay to ensure we're after the initial render
    const timeoutId = setTimeout(hydrateUser, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Find user by email (demo: any password works)
    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (foundUser && password.length >= 4) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    // For demo: create a temporary user for any email
    if (email && password.length >= 4) {
      const tempUser: User = {
        id: "temp-" + Date.now(),
        email: email,
        name: email.split("@")[0],
        associationId: "1",
        associationName: "Association des Acteurs de Côte d'Ivoire",
        associationShortName: email.split("@")[0].toUpperCase().slice(0, 4),
        role: "ADMIN_ASSOCIATION",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tempUser));
      setUser(tempUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    router.push("/");
  }, [router]);

  // Compute isAuthenticated
  const isAuthenticated = !!user;
  const isFederationStaff = user ? FEDERATION_STAFF_ROLES.includes(user.role) : false;
  const canManageCotisations = user ? COTISATION_MANAGERS.includes(user.role) : false;
  
  // Role-specific permissions
  const canConvokeMeetings = user?.role === "PRESIDENT";
  const canManageApplications = user?.role === "SECRETAIRE_GENERAL";
  const canManageWebsite = user?.role === "DIRECTEUR_COMMUNICATION";
  const canManageFinances = user?.role === "TRESORIERE";

  const value = useMemo(() => ({
    user,
    isLoading,
    isHydrated,
    login,
    logout,
    isAuthenticated,
    isFederationStaff,
    canManageCotisations,
    canConvokeMeetings,
    canManageApplications,
    canManageWebsite,
    canManageFinances,
  }), [
    user,
    isLoading,
    isHydrated,
    login,
    logout,
    isAuthenticated,
    isFederationStaff,
    canManageCotisations,
    canConvokeMeetings,
    canManageApplications,
    canManageWebsite,
    canManageFinances
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
