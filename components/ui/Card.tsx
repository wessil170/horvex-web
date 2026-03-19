export default function Card({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }}
    >
      {children}
    </div>

  )

}