"use client"

import { useEffect, useMemo, useState } from "react"

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
BarElement,
ArcElement,
Tooltip,
Legend
} from "chart.js"

import { Line, Pie, Bar } from "react-chartjs-2"

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
BarElement,
ArcElement,
Tooltip,
Legend
)

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type Agendamento = {
id: number
inicio: string
cliente_id: number
servico_id: number
profissional_id: number
}

type Cliente = { id: number; nome: string }
type Servico = { id: number; nome: string; preco: number }
type Profissional = { id: number; nome: string }

export default function DashboardPage(){

const [agendamentos,setAgendamentos] = useState<Agendamento[]>([])
const [clientes,setClientes] = useState<Cliente[]>([])
const [servicos,setServicos] = useState<Servico[]>([])
const [profissionais,setProfissionais] = useState<Profissional[]>([])

useEffect(()=>{
carregarDados()
},[])

async function carregarDados(){

const token = localStorage.getItem("token")

const [a,c,s,p] = await Promise.all([

fetch(`${API_URL}/agendamentos/`,{
headers:{Authorization:`Bearer ${token}`}
}),

fetch(`${API_URL}/clientes/`,{
headers:{Authorization:`Bearer ${token}`}
}),

fetch(`${API_URL}/servicos/`,{
headers:{Authorization:`Bearer ${token}`}
}),

fetch(`${API_URL}/profissionais/`,{
headers:{Authorization:`Bearer ${token}`}
})

])

const ag = await a.json()
const cl = await c.json()
const se = await s.json()
const pr = await p.json()

setAgendamentos(Array.isArray(ag) ? ag : [])
setClientes(Array.isArray(cl) ? cl : [])
setServicos(Array.isArray(se) ? se : [])
setProfissionais(Array.isArray(pr) ? pr : [])

}

const hoje = new Date()
const mesAtual = hoje.getMonth()
const anoAtual = hoje.getFullYear()

const agMes = useMemo(()=>{

const lista = Array.isArray(agendamentos) ? agendamentos : []

return lista.filter(a=>{
const d = new Date(a.inicio)
return d.getMonth() === mesAtual && d.getFullYear() === anoAtual
})

},[agendamentos])

const faturamentoMes = agMes.reduce((total,a)=>{
const serv = servicos.find(s=>s.id === a.servico_id)
return total + (serv?.preco || 0)
},0)

const ticketMedioMes =
agMes.length > 0 ? (faturamentoMes / agMes.length).toFixed(2) : "0"

const clientesUnicos = new Set(agMes.map(a=>a.cliente_id)).size

const diasMes = new Date(anoAtual, mesAtual + 1, 0).getDate()
const horasDia = 10
const capacidadeMes = diasMes * horasDia * profissionais.length

const ocupacaoMes =
capacidadeMes > 0
? Math.round((agMes.length / capacidadeMes) * 100)
: 0

const proximos = [...agendamentos]
.filter(a=>new Date(a.inicio) >= hoje)
.sort((a,b)=>new Date(a.inicio).getTime()-new Date(b.inicio).getTime())
.slice(0,5)

const faturamento30:any = {}

for(let i=29;i>=0;i--){

const d = new Date()
d.setDate(d.getDate()-i)

const key = d.toLocaleDateString("pt-BR")

faturamento30[key] = 0
}

agendamentos.forEach(a=>{

const data = new Date(a.inicio).toLocaleDateString("pt-BR")
const serv = servicos.find(s=>s.id === a.servico_id)

if(faturamento30[data] !== undefined){
faturamento30[data] += serv?.preco || 0
}

})

const chartFaturamento = {
labels:Object.keys(faturamento30),
datasets:[{
label:"Faturamento",
data:Object.values(faturamento30),
borderColor:"#6366f1",
backgroundColor:"rgba(99,102,241,0.15)",
fill:true,
tension:0.4
}]
}

const servicosContagem:any = {}

agMes.forEach(a=>{
servicosContagem[a.servico_id] =
(servicosContagem[a.servico_id] || 0) + 1
})

const pizzaLabels = Object.keys(servicosContagem).map(id=>{
const s = servicos.find(x=>x.id == Number(id))
return s?.nome
})

const pizzaData = Object.values(servicosContagem)

const chartServicos = {
labels:pizzaLabels,
datasets:[{
data:pizzaData,
backgroundColor:[
"#6366f1",
"#10b981",
"#f59e0b",
"#ef4444",
"#8b5cf6"
]
}]
}

const profContagem = profissionais.map(p=>{
const total = agMes.filter(a=>a.profissional_id===p.id).length
return {nome:p.nome,total}
})

const chartProf = {
labels:profContagem.map(p=>p.nome),
datasets:[{
label:"Atendimentos",
data:profContagem.map(p=>p.total),
backgroundColor:"#10b981"
}]
}

return(

<div style={{padding:"30px"}}>

<h1 style={{marginBottom:"25px"}}>Dashboard</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"20px",
marginBottom:"25px"
}}>

<Card titulo="Faturamento do mês" valor={`R$ ${faturamentoMes}`} />
<Card titulo="Ticket médio do mês" valor={`R$ ${ticketMedioMes}`} />
<Card titulo="Clientes atendidos" valor={clientesUnicos} />
<Card titulo="Ocupação do mês" valor={`${ocupacaoMes}%`} />

</div>

<Box titulo="Faturamento últimos 30 dias">

<div style={{height:"320px"}}>
<Line data={chartFaturamento}/>
</div>

</Box>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px",
marginTop:"25px"
}}>

<Box titulo="Serviços mais vendidos">
<div style={{height:"260px"}}>
<Pie data={chartServicos}/>
</div>
</Box>

<Box titulo="Atendimentos por profissional">
<div style={{height:"260px"}}>
<Bar data={chartProf}/>
</div>
</Box>

</div>

<Box titulo="Próximos atendimentos" style={{marginTop:"25px"}}>

{proximos.map(a=>{

const cli = clientes.find(c=>c.id===a.cliente_id)
const serv = servicos.find(s=>s.id===a.servico_id)

const hora = new Date(a.inicio).toLocaleTimeString("pt-BR",{
hour:"2-digit",
minute:"2-digit"
})

return(
<div
key={a.id}
style={{
display:"flex",
justifyContent:"space-between",
padding:"8px 0",
borderBottom:"1px solid #eee"
}}
>

<span>{hora}</span>
<span>{cli?.nome}</span>
<span style={{color:"#666"}}>{serv?.nome}</span>

</div>
)
})}

</Box>

</div>
)

}

function Card({titulo,valor}:any){

return(

<div style={{
background:"#fff",
padding:"20px",
borderRadius:"10px",
boxShadow:"0 2px 10px rgba(0,0,0,0.05)"
}}>

<div style={{fontSize:"14px",color:"#777"}}>
{titulo}
</div>

<div style={{
fontSize:"26px",
fontWeight:"bold",
marginTop:"8px"
}}>
{valor}
</div>

</div>

)

}

function Box({titulo,children,style}:any){

return(

<div style={{
background:"#fff",
padding:"20px",
borderRadius:"10px",
...style
}}>

<h3 style={{marginBottom:"15px"}}>
{titulo}
</h3>

{children}

</div>

)

}
