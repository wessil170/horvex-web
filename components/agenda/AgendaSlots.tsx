import ProfissionalRow from "./ProfissionalRow";

export default function AgendaSlots({ agenda }: any) {

  const profissionais = Object.keys(agenda || {});

  return (

    <div className="space-y-6">

      {profissionais.map((p) => (

        <ProfissionalRow
          key={p}
          profissional={p}
          slots={agenda[p]}
        />

      ))}

    </div>

  );
}