import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "./useAdminAuth";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

export function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? "Error al iniciar sesión");
      }

      const { token } = await res.json() as { token: string };
      setAdminToken(token);
      navigate("/admin/orders", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0e0e0e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "360px",
        padding: "2.5rem",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 0.5rem" }}>
          Sumo Reishi
        </p>
        <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "1.25rem", margin: "0 0 2rem", letterSpacing: "-0.02em" }}>
          Panel de administración
        </h1>

        <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            fontFamily: FONT,
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "1.25rem",
          }}
        />

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "0.7rem", margin: "0 0 1rem" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: loading ? "rgba(255,255,255,0.3)" : "#fff",
            color: "#0e0e0e",
            border: "none",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
