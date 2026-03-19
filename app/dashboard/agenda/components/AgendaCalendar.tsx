"use client"

import { useState } from "react"
import { Calendar, View } from "react-big-calendar"
import { localizer } from "./agendaLocalizer"
import { messages } from "./agendaMessages"
import { corServico } from "./agendaUtils"



import "react-big-calendar/lib/css/react-big-calendar.css"


function EventoCustom({ event }: any) {

  const [servico, cliente] = (event.title || "").split("\n")

  return (
    <div
      style={{
        padding: "4px 6px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "13px",
        fontWeight: 500
      }}
      title={`${servico} - ${cliente}`}
    >
      {servico} - {cliente}
    </div>
  )
}



export default function AgendaCalendar({

  eventos,
  profissionais,
  selecionarEvento,
  selecionarSlot,
  dataAtual,
  setDataAtual

}: any){

  const [view,setView] = useState<View>("day");

  return(

    <div style={{ height:"85vh" }}>

      <Calendar

        localizer={localizer}
        messages={messages}

        events={eventos}
        dayLayoutAlgorithm="no-overlap"


        startAccessor="start"
        endAccessor="end"

        resources={Array.isArray(profissionais) ? profissionais : []}
        resourceIdAccessor="id"
        resourceTitleAccessor="nome"

        selectable

        date={dataAtual}
        onNavigate={(data)=>setDataAtual(data)}
        onDrillDown={(date)=>{

  setDataAtual(date)
  setView("day")
}}

        onSelectEvent={selecionarEvento}
        
        onSelectSlot={(slot)=>{

  // se estiver no modo mês, abrir o dia
  if(view === "month"){
    setDataAtual(slot.start)
    setView("day")
    return
  }

  // nos outros modos abre o modal
  selecionarSlot(slot)

}}


        views={["day","week","month"] as View[]}
        view={view}
        onView={(v: View)=>setView(v)}


        step={30}
        timeslots={2}

        min={new Date(0,0,0,8,0,0)}
        max={new Date(0,0,0,19,0,0)}

        formats={{
          timeGutterFormat:"HH:mm"
        }}

        components={{
          event: EventoCustom
        }}

        eventPropGetter={(event)=>{

  const servico = event.title.split("\n")[0]

  return{

    style:{
      backgroundColor: corServico(servico),
      border:"none",
      color:"#fff",
      borderRadius:"6px",
      padding:"6px",
      fontSize:"13px",

      height:"70px",      // altura fixa
      maxHeight:"70px",   // impede compressão
      overflow:"hidden"   // evita quebrar layout
    }

  }

}}


      />

    </div>

  )

}