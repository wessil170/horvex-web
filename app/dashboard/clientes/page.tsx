"use client"

import { useEffect, useState } from "react"
import PageHeader from "@/components/ui/PageHeader"
import Card from "@/components/ui/Card"
import GridContainer from "@/components/ui/GridContainer"
import ConfirmModal from "@/components/ui/ConfirmModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

function mascaraTelefone(valor: string) {

  const numeros = valor.replace(/\D/g,"").slice(0,11)

  if(numeros.length <= 2){
    return numeros
  }

  if(numeros.length <= 6){
    return `(${numeros.slice(0,2)}) ${numeros.slice(2)}`
  }

  if(numeros.length <= 10){
    return `(${numeros.slice(0,2)}) ${numeros.slice(2,6)}-${numeros.slice(6)}`
  }

  return `(${numeros.slice(0,2)}) ${numeros.slice(2,7)}-${numeros.slice(7)}`
}

function formatTelefone(telefone: string) {

  const numeros = telefone.replace(/\D/g,"").slice(0,11)

  if(numeros.length === 11){
    return `(${numeros.slice(0,2)}) ${numeros.slice(2,7)}-${numeros.slice(7)}`
  }

  if(numeros.length === 10){
    return `(${numeros.slice(0,2)}) ${numeros.slice(2,6)}-${numeros.slice(6)}`
  }

  return numeros
}

export default function ClientesPage(){

  const [clientes,setClientes] = useState<any[]>([])
  const [mostrarForm,setMostrarForm] = useState(false)

  const [editandoId,setEditandoId] = useState<number | null>(null)

  const [nome,setNome] = useState("")
  const [telefone,setTelefone] = useState("")
  const [observacoes,setObservacoes] = useState("")

  const [confirmarDelete,setConfirmarDelete] = useState(false)
  const [clienteDeleteId,setClienteDeleteId] = useState<number | null>(null)

  useEffect(()=>{
    carregarClientes()
  },[])

  async function carregarClientes(){

    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/clientes`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    const json = await res.json()

    if(Array.isArray(json)) setClientes(json)

  }

  function abrirNovo(){

    setEditandoId(null)

    setNome("")
    setTelefone("")
    setObservacoes("")

    setMostrarForm(true)

  }

  function editarCliente(cliente:any){

    setEditandoId(cliente.id)

    setNome(cliente.nome)
    setTelefone(cliente.telefone)
    setObservacoes(cliente.observacoes || "")

    setMostrarForm(true)

  }

  async function salvarCliente(){

    const token = localStorage.getItem("token")

    const body = JSON.stringify({
      nome,
      telefone,
      observacoes
    })

    if(editandoId){

      await fetch(`${API_URL}/clientes/${editandoId}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body
      })

    }else{

      await fetch(`${API_URL}/clientes`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body
      })

    }

    setMostrarForm(false)

    carregarClientes()

  }

  async function excluirCliente(){

    if(!clienteDeleteId) return

    const token = localStorage.getItem("token")

    await fetch(`${API_URL}/clientes/${clienteDeleteId}`,{
      method:"DELETE",
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    setConfirmarDelete(false)
    setClienteDeleteId(null)

    carregarClientes()

  }

  return(

    <div>

      <PageHeader
        title="Clientes"
        subtitle="Gerencie os clientes do salão"
        action={
          <button
            onClick={abrirNovo}
            style={{
              background:"#0f172a",
              color:"white",
              border:"none",
              padding:"10px 16px",
              borderRadius:"8px",
              cursor:"pointer"
            }}
          >
            + Novo Cliente
          </button>
        }
      />

      {mostrarForm && (

        <div
          style={{
            background:"white",
            padding:"20px",
            borderRadius:"10px",
            marginBottom:"30px",
            border:"1px solid #e2e8f0"
          }}
        >

          <h3>{editandoId ? "Editar Cliente" : "Novo Cliente"}</h3>

          <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>

            <input
              placeholder="Nome"
              value={nome}
              onChange={(e)=>setNome(e.target.value)}
              style={{padding:"8px",border:"1px solid #ddd",borderRadius:"6px"}}
            />

            <input
  placeholder="Telefone"
  value={telefone}
  onChange={(e)=>{

    const formatado = mascaraTelefone(e.target.value)
    setTelefone(formatado)

  }}
  style={{
    padding:"8px",
    border:"1px solid #ddd",
    borderRadius:"6px",
    width:"180px"
  }}
/>

            <input
              placeholder="Observações"
              value={observacoes}
              onChange={(e)=>setObservacoes(e.target.value)}
              style={{padding:"8px",border:"1px solid #ddd",borderRadius:"6px"}}
            />

          </div>

          <div style={{marginTop:"10px",display:"flex",gap:"10px"}}>

            <button
              onClick={salvarCliente}
              style={{
                background:"#0f172a",
                color:"white",
                border:"none",
                padding:"8px 12px",
                borderRadius:"6px"
              }}
            >
              Salvar
            </button>

            <button
              onClick={()=>setMostrarForm(false)}
              style={{
                background:"#e2e8f0",
                border:"none",
                padding:"8px 12px",
                borderRadius:"6px"
              }}
            >
              Cancelar
            </button>

          </div>

        </div>

      )}

      <GridContainer>

        {clientes.map((c)=>(

          <Card key={c.id}>

            <h3 style={{margin:0}}>
              {c.nome}
            </h3>

            <p style={{color:"#64748b"}}>
              📞 {formatTelefone(c.telefone)}
            </p>

            {c.observacoes && (
  <div style={{marginTop:"6px"}}>
    <span style={{
      fontSize:"12px",
      color:"#94a3b8",
      fontWeight:500
    }}>
      Observações
    </span>

    <p style={{
      fontSize:"14px",
      color:"#475569",
      marginTop:"2px"
    }}>
      {c.observacoes}
    </p>
  </div>
)}
            <div style={{display:"flex",gap:"10px",marginTop:"12px"}}>

              <button
                onClick={()=>editarCliente(c)}
                style={{
                  padding:"6px 10px",
                  borderRadius:"6px",
                  border:"1px solid #ddd",
                  background:"white",
                  cursor:"pointer"
                }}
              >
                Editar
              </button>

              <button
                onClick={()=>{
                  setClienteDeleteId(c.id)
                  setConfirmarDelete(true)
                }}
                style={{
                  padding:"6px 10px",
                  borderRadius:"6px",
                  border:"none",
                  background:"#ef4444",
                  color:"white",
                  cursor:"pointer"
                }}
              >
                Excluir
              </button>

            </div>

          </Card>

        ))}

      </GridContainer>

      <ConfirmModal
        open={confirmarDelete}
        title="Excluir cliente"
        description="Essa ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={excluirCliente}
        onCancel={()=>setConfirmarDelete(false)}
      />

    </div>

  )

}