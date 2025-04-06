"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProfile, logout, verifyToken } from "@/lib/api/auth";
import { isProtectedRoute } from "@/config/auth";

interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated for protected routes
  useEffect(() => {
    if (!loading) {
      // Mevcut yolun korumalı olup olmadığını kontrol et
      const shouldRedirect = !isAuthenticated && isProtectedRoute(pathname);

      if (shouldRedirect) {
        router.push(`/login?callbackUrl=${pathname}`);
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Get user profile from the server (only when needed)
  const fetchUserProfile = async (): Promise<User | null> => {
    try {
      const response = await getProfile();
      if (response.status && response.data) {
        setUser(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Verify token validity without fetching the entire profile
  const checkAuth = async (): Promise<void> => {
    try {
      setLoading(true);
      // Hafif token doğrulama isteği
      const response = await verifyToken();

      setIsAuthenticated(response.status === true);

      // Eğer token geçerliyse ve kullanıcı henüz yüklenmemişse, profili getir
      if (response.status && !user) {
        await fetchUserProfile();
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout: handleLogout,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
