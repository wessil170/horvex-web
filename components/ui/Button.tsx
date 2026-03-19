type Props = {
  children: React.ReactNode
  onClick?: () => void
}

export default function Button({ children, onClick }: Props) {
  return (

    <button
      onClick={onClick}
      className="
        bg-blue-600
        text-white
        px-5
        py-2.5
        rounded-xl
        shadow-sm
        hover:bg-blue-700
        transition
        text-sm
        font-medium
      "
    >
      {children}
    </button>

  )
}