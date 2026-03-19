export default function AgendaModal({

  modal,
  setModal,
  clientes,
  servicos,
  profissionais,

  cliente,
  setCliente,

  servico,
  setServico,

  profissional,
  setProfissional,

  salvar,
  excluir,
  eventoSelecionado,
  inicio

}: any) {

  if (!modal) return null

  return (

    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        width: "320px"
      }}>

        <h3>Agendamento</h3>

        <p>

          {inicio?.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          })}

        </p>

        <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
          <option>Cliente</option>

          {clientes.map((c: any) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}

        </select>

        <select value={servico} onChange={(e) => setServico(e.target.value)}>
          <option>Serviço</option>

          {servicos.map((s: any) => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}

        </select>

        <select value={profissional} onChange={(e) => setProfissional(e.target.value)}>
          <option>Profissional</option>

          {profissionais.map((p: any) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}

        </select>

        <br /><br />

        <button onClick={salvar}>Salvar</button>

        {eventoSelecionado && (
          <button onClick={excluir}>Excluir</button>
        )}

        <button onClick={() => setModal(false)}>Cancelar</button>

      </div>

    </div>

  )

}