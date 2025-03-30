import { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";

const API_URL = "http://localhost:5000";

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ApiError {
  status: boolean;
  message: string;
}

export async function login(
  data: LoginFormValues
): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Cookie'leri gönder ve al
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(data: RegisterFormValues): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Cookie'leri gönder ve al
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

export async function logout(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Cookie'leri gönder ve al
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Logout failed");
    }

    return result;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function getProfile(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Cookie'leri gönder ve al
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get profile");
    }

    return result;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
}

export async function verifyToken(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      // Sessizce başarısız ol
      return { status: false, message: "Token invalid" };
    }

    return result;
  } catch (error) {
    // Hata konsola yazılmadı, sadece sonuç döndürüldü
    return { status: false, message: "Token verification failed" };
  }
}
