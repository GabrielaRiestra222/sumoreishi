import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "adminToken";

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function useRequireAdmin() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login", { replace: true });
    } else {
      setReady(true);
    }
  }, [navigate]);

  return ready;
}

export function useAdminFetch() {
  const navigate = useNavigate();

  return useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const token = getAdminToken();
      if (!token) {
        navigate("/admin/login", { replace: true });
        throw new Error("No autenticado");
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers ?? {}),
        },
      });

      if (response.status === 401) {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
        throw new Error("Sesión expirada");
      }

      return response;
    },
    [navigate]
  );
}
