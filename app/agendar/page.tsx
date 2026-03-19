"use client"

import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type Servico = {
  id: number
  nome: string
}

type Profissional = {
  id: number
  nome: string
}

export default function AgendarPage(){

  const [servicos,setServicos] = useState<Servico[]>([])
  const [profissionais,setProfissionais] = useState<Profissional[]>([])

  const [nome,setNome] = useState("")
  const [servico,setServico] = useState("")
  const [profissional,setProfissional] = useState("")
  const [data,setData] = useState("")
  const [hora,setHora] = useState("")

  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    carregar()
  },[])

  async function carregar(){

    try{

      const [s,p] = await Promise.all([
        fetch(`${API_URL}/servicos/`),
        fetch(`${API_URL}/profissionais/`)
      ])

      const servicosData = await s.json()
      const profissionaisData = await p.json()

      // 🔥 proteção contra erro de map
      setServicos(
        Array.isArray(servicosData)
          ? servicosData
          : servicosData.data || []
      )

      setProfissionais(
        Array.isArray(profissionaisData)
          ? profissionaisData
          : profissionaisData.data || []
      )

    }catch(err){
      console.error("Erro ao carregar dados:", err)
    }
  }

  async function agendar(){

    if(!servico || !profissional || !data || !hora){
      alert("Preencha todos os campos")
      return
    }

    setLoading(true)

    try{

      await fetch(`${API_URL}/agendamentos/`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          cliente_nome: nome, // 🔥 pode ajustar depois
          servico_id: Number(servico),
          profissional_id: Number(profissional),
          inicio: `${data}T${hora}:00`
        })
      })

      alert("Agendado com sucesso!")

      // limpa campos
      setNome("")
      setServico("")
      setProfissional("")
      setData("")
      setHora("")

    }catch(err){
      alert("Erro ao agendar")
    }

    setLoading(false)
  }

  return(

    <div style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#f5f6fa"
    }}>

      <div style={{
        width:"400px",
        background:"#fff",
        padding:"30px",
        borderRadius:"12px",
        boxShadow:"0 10px 30px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{marginBottom:"10px"}}>
          Agendar horário
        </h2>

        <p style={{color:"#666",marginBottom:"20px"}}>
          Escolha os dados abaixo
        </p>

        <input
          placeholder="Seu nome"
          value={nome}
          onChange={(e)=>setNome(e.target.value)}
          style={input}
        />

        <select
          value={servico}
          onChange={(e)=>setServico(e.target.value)}
          style={input}
        >
          <option value="">Selecione o serviço</option>

          {Array.isArray(servicos) && servicos.map((s)=>(
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>

        <select
          value={profissional}
          onChange={(e)=>setProfissional(e.target.value)}
          style={input}
        >
          <option value="">Selecione o profissional</option>

          {Array.isArray(profissionais) && profissionais.map((p)=>(
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={data}
          onChange={(e)=>setData(e.target.value)}
          style={input}
        />

        <input
          type="time"
          value={hora}
          onChange={(e)=>setHora(e.target.value)}
          style={input}
        />

        <button
          onClick={agendar}
          style={button}
          disabled={loading}
        >
          {loading ? "Agendando..." : "Confirmar"}
        </button>

      </div>

    </div>

  )
}

const input = {
  width:"100%",
  padding:"10px",
  marginBottom:"12px",
  borderRadius:"6px",
  border:"1px solid #ccc"
}

const button = {
  display:"block",
  width:"60%",
  margin:"15px auto 0",
  padding:"12px",
  background:"linear-gradient(135deg,#6366f1,#4f46e5)",
  color:"#fff",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer",
  fontWeight:"bold"
}
