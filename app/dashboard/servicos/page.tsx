"use client"

import { useEffect, useState } from "react"
import PageHeader from "@/components/ui/PageHeader"
import Card from "@/components/ui/Card"
import GridContainer from "@/components/ui/GridContainer"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export default function ServicosPage() {

  const [servicos, setServicos] = useState<any[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)

  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [nome,setNome] = useState("")
  const [duracao,setDuracao] = useState("")
  const [preco,setPreco] = useState("")

  const [confirmarDelete, setConfirmarDelete] = useState(false)
  const [servicoDeleteId, setServicoDeleteId] = useState<number | null>(null)

  useEffect(() => {
    carregarServicos()
  }, [])

  async function carregarServicos(){

    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/servicos`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    const json = await res.json()

    if(Array.isArray(json)) setServicos(json)

  }

  function abrirNovo(){

    setEditandoId(null)

    setNome("")
    setDuracao("")
    setPreco("")

    setMostrarForm(true)

  }

  function editarServico(servico:any){

    setEditandoId(servico.id)

    setNome(servico.nome)
    setDuracao(servico.duracao)
    setPreco(servico.preco)

    setMostrarForm(true)

  }

  async function salvarServico(){

    const token = localStorage.getItem("token")

    const body = JSON.stringify({
      nome,
      duracao:Number(duracao),
      preco:Number(preco)
    })

    if(editandoId){

      await fetch(`${API_URL}/servicos/${editandoId}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body
      })

    }else{

      await fetch(`${API_URL}/servicos`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body
      })

    }

    setMostrarForm(false)

    carregarServicos()

  }

 async function excluirServico(){

  if(!servicoDeleteId) return

  const token = localStorage.getItem("token")

  await fetch(`${API_URL}/servicos/${servicoDeleteId}`,{
    method:"DELETE",
    headers:{
      Authorization:`Bearer ${token}`
    }
  })

  setConfirmarDelete(false)
  setServicoDeleteId(null)

  carregarServicos()
}

  return (

    <div>

      <PageHeader
        title="Serviços"
        subtitle="Gerencie os serviços oferecidos pelo salão"
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
            + Novo Serviço
          </button>
        }
      />

      {mostrarForm && (

        <div style={{
          background:"white",
          padding:"20px",
          borderRadius:"10px",
          marginBottom:"30px",
          border:"1px solid #e2e8f0"
        }}>

          <h3>{editandoId ? "Editar Serviço" : "Novo Serviço"}</h3>

          <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>

            <input
              placeholder="Nome"
              value={nome}
              onChange={(e)=>setNome(e.target.value)}
              style={{padding:"8px",border:"1px solid #ddd",borderRadius:"6px"}}
            />

            <input
              placeholder="Duração"
              value={duracao}
              onChange={(e)=>setDuracao(e.target.value)}
              style={{padding:"8px",border:"1px solid #ddd",borderRadius:"6px"}}
            />

            <input
              placeholder="Preço"
              value={preco}
              onChange={(e)=>setPreco(e.target.value)}
              style={{padding:"8px",border:"1px solid #ddd",borderRadius:"6px"}}
            />

          </div>

          <div style={{marginTop:"10px",display:"flex",gap:"10px"}}>

            <button
              onClick={salvarServico}
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

        {servicos.map((s)=>(

          <Card key={s.id}>

            <h3 style={{margin:0}}>
              {s.nome}
            </h3>

            <p style={{color:"#64748b"}}>
              {s.duracao} minutos
            </p>

            <div style={{fontWeight:600,marginTop:"8px"}}>
              R$ {s.preco}
            </div>

            <div style={{display:"flex",gap:"10px",marginTop:"12px"}}>

              <button
                onClick={()=>editarServico(s)}
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
                onClick={() => {
                  setServicoDeleteId(s.id)
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

      {confirmarDelete && (

        <div
          style={{
            position:"fixed",
            inset:0,
            background:"rgba(0,0,0,0.4)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            zIndex:1000
          }}
        >

          <div
            style={{
              background:"white",
              padding:"30px",
              borderRadius:"10px",
              width:"350px",
              textAlign:"center"
            }}
          >

            <h3>Excluir serviço</h3>

            <p style={{color:"#64748b"}}>
              Essa ação não pode ser desfeita.
            </p>

            <div
              style={{
                marginTop:"20px",
                display:"flex",
                justifyContent:"center",
                gap:"10px"
              }}
            >

              <button
                onClick={()=>setConfirmarDelete(false)}
                style={{
                  padding:"8px 14px",
                  borderRadius:"6px",
                  border:"1px solid #ddd",
                  background:"white",
                  cursor:"pointer"
                }}
              >
                Cancelar
              </button>

              <button
                onClick={excluirServico}
                style={{
                  padding:"8px 14px",
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

          </div>

        </div>

      )}

    </div>

  )

}