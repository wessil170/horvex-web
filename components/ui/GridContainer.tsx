export default function GridContainer({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
        gap: "20px"
      }}
    >
      {children}
    </div>

  )

}