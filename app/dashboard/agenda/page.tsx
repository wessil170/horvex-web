"use client"

import { useEffect, useState } from "react"

import AgendaCalendar from "./components/AgendaCalendar"
import AgendaModal from "./components/AgendaModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

function formatarDataAPI(data: Date) {

  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const dia = String(data.getDate()).padStart(2, "0")

  const hora = String(data.getHours()).padStart(2, "0")
  const min = String(data.getMinutes()).padStart(2, "0")

  return `${ano}-${mes}-${dia}T${hora}:${min}:00`
}

export default function AgendaPage() {

  const [eventos,setEventos] = useState<any[]>([])
  const [clientes,setClientes] = useState<any[]>([])
  const [servicos,setServicos] = useState<any[]>([])
  const [profissionais,setProfissionais] = useState<any[]>([])

  const [modal,setModal] = useState(false)
  const [eventoSelecionado,setEventoSelecionado] = useState<any>(null)

  const [cliente,setCliente] = useState("")
  const [servico,setServico] = useState("")
  const [profissional,setProfissional] = useState("")
  const [inicio,setInicio] = useState<Date | null>(null)

  const [dataAtual,setDataAtual] = useState(new Date())

  useEffect(()=>{

    carregarDados()

  },[])

  async function carregarDados(){

    const token = localStorage.getItem("token")

    const [agendaRes,cliRes,serRes,proRes] = await Promise.all([

      fetch(`${API_URL}/agendamentos/`,{
        headers:{ Authorization:`Bearer ${token}` }
      }),

      fetch(`${API_URL}/clientes/`,{
        headers:{ Authorization:`Bearer ${token}` }
      }),

      fetch(`${API_URL}/servicos/`,{
        headers:{ Authorization:`Bearer ${token}` }
      }),

      fetch(`${API_URL}/profissionais/`,{
        headers:{ Authorization:`Bearer ${token}` }
      })

    ])

    const ag = await agendaRes.json()
    const c = await cliRes.json()
    const s = await serRes.json()
    const p = await proRes.json()

    setClientes(c)
    setServicos(s)
    setProfissionais(p)

   const listaAgendamentos = Array.isArray(ag) ? ag : []

const eventosFormatados = listaAgendamentos.map((a:any)=>({

  id: a.id,

  title: `${a.servico || ""}\n${a.cliente || ""}`,

  start: new Date(a.inicio),
  end: new Date(a.fim),

  resourceId: a.profissional_id, // 🔥 ESSENCIAL

  resource: a

}))


    setEventos(eventosFormatados)

  }

  function selecionarEvento(evento:any){

    const e = evento.resource

    setEventoSelecionado(e)

    setCliente(e.cliente_id)
    setServico(e.servico_id)
    setProfissional(e.profissional_id)
    setInicio(new Date(e.inicio))

    setModal(true)

  }

  function selecionarSlot(slot:any){

    setEventoSelecionado(null)

    setCliente("")
    setServico("")
    setProfissional(slot.resourceId)
    setInicio(slot.start)

    setModal(true)

  }

  async function salvar(){

    const novoInicio = new Date(inicio!)

const serv = servicos.find((s:any)=>s.id == servico)

const duracao = serv?.duracao || 30

const novoFim = new Date(novoInicio.getTime() + duracao * 60000)

const conflito = eventos.some((e:any)=>{

  if(e.resource.profissional_id != profissional) return false

  const inicioExistente = new Date(e.start)
  const fimExistente = new Date(e.end)

  return (
    novoInicio < fimExistente &&
    novoFim > inicioExistente
  )

})

if(conflito){

  alert("Horário indisponível")

  return

}


    const token = localStorage.getItem("token")

    const body = JSON.stringify({

      cliente_id:cliente,
      servico_id:servico,
      profissional_id:profissional,
      inicio:formatarDataAPI(inicio!)

    })

    if(eventoSelecionado){

      await fetch(`${API_URL}/agendamentos/${eventoSelecionado.id}`,{

        method:"PUT",

        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },

        body

      })

    }else{

      await fetch(`${API_URL}/agendamentos/`,{

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },

        body

      })

    }

    setModal(false)

    carregarDados()

  }

  async function excluir(){

    const token = localStorage.getItem("token")

    await fetch(`${API_URL}/agendamentos/${eventoSelecionado.id}`,{

      method:"DELETE",

      headers:{
        Authorization:`Bearer ${token}`
      }

    })

    setModal(false)

    carregarDados()

  }

  return(

    <>

      <AgendaCalendar

        eventos={eventos}
        profissionais={profissionais}

        selecionarEvento={selecionarEvento}
        selecionarSlot={selecionarSlot}

        dataAtual={dataAtual}
        setDataAtual={setDataAtual}

      />

      <AgendaModal

        modal={modal}
        setModal={setModal}

        clientes={clientes}
        servicos={servicos}
        profissionais={profissionais}

        cliente={cliente}
        setCliente={setCliente}

        servico={servico}
        setServico={setServico}

        profissional={profissional}
        setProfissional={setProfissional}

        salvar={salvar}
        excluir={excluir}

        eventoSelecionado={eventoSelecionado}
        inicio={inicio}

      />

    </>

  )

}