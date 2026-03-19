type Props = {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: Props) {

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}
    >

      <div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            margin: 0
          }}
        >
          {title}
        </h1>

        {subtitle && (

          <p
            style={{
              marginTop: "6px",
              color: "#64748b"
            }}
          >
            {subtitle}
          </p>

        )}

      </div>

      {action}

    </div>

  )

}