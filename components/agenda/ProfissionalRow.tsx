import SlotButton from "./SlotButton";

type Props = {
  profissional: string;
  slots: any[];
};

export default function ProfissionalRow({
  profissional,
  slots
}: Props) {

  return (

    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">

      <h3 className="font-semibold text-lg text-gray-700">
        {profissional}
      </h3>

      <div className="grid grid-cols-6 gap-3">

        {slots.map((slot, i) => (

          <SlotButton
            key={i}
            hora={slot.hora}
            ocupado={slot.ocupado}
            cliente={slot.cliente}
          />

        ))}

      </div>

    </div>

  );
}