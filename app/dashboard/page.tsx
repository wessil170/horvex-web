"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function DashboardPage() {
  const router = useRouter();

  const [servicos, setServicos] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("");
  const [message, setMessage] = useState("Carregando...");

  async function fetchServicos(token: string) {
    try {
      const response = await fetch(`${API_URL}/servicos/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar serviços");
      }

      const data = await response.json();
      setServicos(data);
      setMessage("");
    } catch (error: any) {
      console.error(error);
      setMessage(error.message);
    }
  }

  async function handleCreateServico(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/servicos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          preco: parseFloat(preco),
          duracao: parseInt(duracao),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar serviço");
      }

      setNome("");
      setPreco("");
      setDuracao("");

      fetchServicos(token);
    } catch (error: any) {
      console.error(error);
      setMessage(error.message);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchServicos(token);
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <h2>Criar Serviço</h2>
      <form onSubmit={handleCreateServico}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <input
          placeholder="Duração (min)"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
        />
        <button type="submit">Criar</button>
      </form>

      <h2>Serviços</h2>
      {servicos.length === 0 && <p>Nenhum serviço cadastrado.</p>}

      <ul>
        {servicos.map((servico) => (
          <li key={servico.id}>
            {servico.nome} - R$ {servico.preco} - {servico.duracao} min
          </li>
        ))}
      </ul>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
