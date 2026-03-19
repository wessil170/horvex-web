"use client"

import { useEffect, useState } from "react"
import PageHeader from "@/components/ui/PageHeader"
import Card from "@/components/ui/Card"
import GridContainer from "@/components/ui/GridContainer"
import ConfirmModal from "@/components/ui/ConfirmModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export default function ProfissionaisPage(){

  const [profissionais,setProfissionais] = useState<any[]>([])
  const [mostrarForm,setMostrarForm] = useState(false)

  const [editandoId,setEditandoId] = useState<number | null>(null)
  const [nome,setNome] = useState("")

  const [confirmarDelete,setConfirmarDelete] = useState(false)
  const [profissionalDeleteId,setProfissionalDeleteId] = useState<number | null>(null)

  useEffect(()=>{
    carregarProfissionais()
  },[])

  async function carregarProfissionais(){

    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/profissionais/`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    const json = await res.json()

    if(Array.isArray(json)){
      setProfissionais(json)
    }

  }

  function abrirNovo(){

    setEditandoId(null)
    setNome("")
    setMostrarForm(true)

  }

  function editarProfissional(p:any){

    setEditandoId(p.id)
    setNome(p.nome)
    setMostrarForm(true)

  }

  async function salvarProfissional(){

    const token = localStorage.getItem("token")

    const body = JSON.stringify({
      nome
    })

    if(editandoId){

      await fetch(`${API_URL}/profissionais/${editandoId}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body
      })

    }else{

      await fetch(`${API_URL}/profissionais/`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body
      })

    }

    setMostrarForm(false)

    carregarProfissionais()

  }

  async function excluirProfissional(){

    if(!profissionalDeleteId) return

    const token = localStorage.getItem("token")

    await fetch(`${API_URL}/profissionais/${profissionalDeleteId}`,{
      method:"DELETE",
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    setConfirmarDelete(false)
    setProfissionalDeleteId(null)

    carregarProfissionais()

  }

  return(

    <div>

      <PageHeader
        title="Profissionais"
        subtitle="Gerencie os profissionais do salão"
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
            + Novo Profissional
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

          <h3>{editandoId ? "Editar Profissional" : "Novo Profissional"}</h3>

          <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>

            <input
              placeholder="Nome"
              value={nome}
              onChange={(e)=>setNome(e.target.value)}
              style={{
                padding:"8px",
                border:"1px solid #ddd",
                borderRadius:"6px"
              }}
            />

          </div>

          <div style={{marginTop:"10px",display:"flex",gap:"10px"}}>

            <button
              onClick={salvarProfissional}
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

        {profissionais.map((p)=>(

          <Card key={p.id}>

            <h3 style={{margin:0}}>
              {p.nome}
            </h3>

            <div style={{display:"flex",gap:"10px",marginTop:"12px"}}>

              <button
                onClick={()=>editarProfissional(p)}
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
                  setProfissionalDeleteId(p.id)
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
        title="Excluir profissional"
        description="Essa ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={excluirProfissional}
        onCancel={()=>setConfirmarDelete(false)}
      />

    </div>

  )

}