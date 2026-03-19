"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function AgendarPage() {
  const params = useParams();
const slug = Array.isArray(params.slug)
  ? params.slug[0]
  : params.slug;


  const [salon, setSalon] = useState<any>(null);
  const [servicos, setServicos] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);

  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [profissionalSelecionado, setProfissionalSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // 🔹 carregar salão
  useEffect(() => {
    if (!slug) return;

    fetch(`${API_URL}/salons/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => setSalon(data));
  }, [slug]);

  // 🔹 serviços
  useEffect(() => {
    if (!salon) return;

    fetch(`${API_URL}/servicos/salon/${salon.id}`)
      .then((res) => res.json())
      .then((data) => {
        setServicos(Array.isArray(data) ? data : []);
      });
  }, [salon]);

  // 🔹 profissionais
  useEffect(() => {
    if (!salon) return;

    fetch(`${API_URL}/profissionais/publico/${salon.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfissionais(Array.isArray(data) ? data : []);
      })
      .catch(() => setProfissionais([]));
  }, [salon]);

  // 🔥 reset ao trocar filtros
  useEffect(() => {
    setHorarios([]);
    setHorarioSelecionado("");
  }, [servicoSelecionado, profissionalSelecionado, dataSelecionada]);

  // 🔹 buscar horários (CORRIGIDO)
  useEffect(() => {
    if (!dataSelecionada || !profissionalSelecionado || !servicoSelecionado) {
      setHorarios([]);
      return;
    }

    const controller = new AbortController();

    async function buscarHorarios() {
      try {
        const res = await fetch(
          `${API_URL}/agendamentos/horarios-disponiveis?data=${dataSelecionada}&profissional_id=${profissionalSelecionado}&servico_id=${servicoSelecionado}&slug=${slug}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        console.log("HORARIOS:", data);

        setHorarios(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setHorarios([]);
        }
      }
    }

    buscarHorarios();

    return () => controller.abort();
  }, [dataSelecionada, profissionalSelecionado, servicoSelecionado, slug]);

  // 🔥 máscara telefone
  function formatarTelefone(value: string) {
    value = value.replace(/\D/g, "").slice(0, 11);

    if (value.length > 6) {
      return value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
    } else if (value.length > 2) {
      return value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else {
      return value.replace(/^(\d*)$/, "($1");
    }
  }

  // 🔥 agendar
  async function handleAgendar() {
    if (!nome || !telefone || !horarioSelecionado) {
      alert("Preencha todos os campos");
      return;
    }

    if (telefone.replace(/\D/g, "").length < 10) {
      alert("Telefone inválido");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/agendamentos/publico`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          telefone,
          data: dataSelecionada,
          horario: horarioSelecionado,
          servico_id: Number(servicoSelecionado),
          profissional_id: Number(profissionalSelecionado),
          slug,
        }),
      });

      if (!res.ok) throw new Error();

      setSucesso(true);

      // 🔥 reset completo
      setNome("");
      setTelefone("");
      setHorarioSelecionado("");
      setHorarios([]);

      setTimeout(() => setSucesso(false), 3000);
    } catch {
      alert("Erro ao agendar");
    } finally {
      setLoading(false);
    }
  }

  const podeAgendar =
    nome &&
    telefone &&
    horarioSelecionado &&
    servicoSelecionado &&
    profissionalSelecionado &&
    dataSelecionada;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Agendar horário</h1>

        {sucesso && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-center">
            Agendamento realizado com sucesso 🎉
          </div>
        )}

        {/* SERVIÇO */}
        <label className="text-sm">Serviço</label>
        <select
          value={servicoSelecionado}
          onChange={(e) => setServicoSelecionado(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        >
          <option value="">Selecione</option>
          {servicos.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome} - R$ {s.preco}
            </option>
          ))}
        </select>

        {/* PROFISSIONAL */}
        <label className="text-sm">Profissional</label>
        <select
          value={profissionalSelecionado}
          onChange={(e) => setProfissionalSelecionado(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        >
          <option value="">Selecione</option>
          {profissionais.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        {/* DATA */}
        <label className="text-sm">Data</label>
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        {/* HORÁRIOS */}
        <div className="mb-4">
          <label className="text-sm">Horários</label>

          {horarios.length === 0 ? (
            <p className="text-gray-400 text-sm mt-2">
              Nenhum horário disponível
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {horarios.map((h) => (
                <button
                  key={h}
                  onClick={() => setHorarioSelecionado(h)}
                  className={`p-2 rounded-lg text-sm transition ${
                    horarioSelecionado === h
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NOME */}
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        {/* TELEFONE */}
        <input
          type="tel"
          placeholder="(51) 99999-9999"
          value={telefone}
          onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
          className="w-full border rounded-lg p-3 mb-4"
        />

        {/* BOTÃO */}
        <button
          onClick={handleAgendar}
          disabled={!podeAgendar || loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Agendando..." : "Confirmar Agendamento"}
        </button>
      </div>
    </div>
  );
}
