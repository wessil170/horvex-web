"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  function navStyle(path: string) {
    const active = pathname === path;
    return {
      padding: "12px 16px",
      borderRadius: "8px",
      backgroundColor: active ? "#1e293b" : "transparent",
      color: "white",
      textDecoration: "none",
      fontWeight: active ? "600" : "400",
      transition: "all 0.2s ease",
      display: "block",
    };
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", letterSpacing: "1px" }}>
            HORVEX
          </h2>
          <span style={{ fontSize: "12px", opacity: 0.6 }}>
            Sistema de Agendamento
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
  <Link href="/dashboard" style={navStyle("/dashboard")}>
    Dashboard
  </Link>

  <Link href="/dashboard/agenda" style={navStyle("/dashboard/agenda")}>
    Agenda
  </Link>

  <Link href="/dashboard/clientes" style={navStyle("/dashboard/clientes")}>
    Clientes
  </Link>

  <Link href="/dashboard/servicos" style={navStyle("/dashboard/servicos")}>
    Serviços
  </Link>

  <Link href="/dashboard/profissionais" style={navStyle("/dashboard/profissionais")}>
    Profissionais
  </Link>

  <Link href="/dashboard/relatorios" style={navStyle("/dashboard/relatorios")}>
    Relatórios
  </Link>

  <Link href="/dashboard/configuracoes" style={navStyle("/dashboard/configuracoes")}>
    Configurações
  </Link>
</nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ef4444",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo principal */}
      <main
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          padding: "40px",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}