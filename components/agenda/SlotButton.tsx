type Props = {
  hora: string;
  ocupado?: boolean;
  cliente?: string;
  onClick?: () => void;
};

export default function SlotButton({
  hora,
  ocupado,
  cliente,
  onClick
}: Props) {

  if (ocupado) {
    return (
      <div className="bg-blue-500 text-white rounded-xl px-4 py-3 text-sm text-center shadow">
        <div className="font-medium">{cliente}</div>
        <div className="text-xs opacity-80">{hora}</div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="
        bg-white
        border
        border-gray-200
        rounded-xl
        px-4 py-3
        text-sm
        hover:bg-blue-50
        hover:border-blue-400
        transition
        shadow-sm
      "
    >
      {hora}
    </button>
  );
}