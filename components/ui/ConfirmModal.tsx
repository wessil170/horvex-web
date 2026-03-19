"use client"

type ConfirmModalProps = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel
}: ConfirmModalProps) {

  if (!open) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "12px",
          width: "360px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          textAlign: "center"
        }}
      >
        <h3 style={{marginTop:0}}>
          {title}
        </h3>

        {description && (
          <p style={{color:"#64748b"}}>
            {description}
          </p>
        )}

        <div
          style={{
            marginTop:"20px",
            display:"flex",
            justifyContent:"center",
            gap:"10px"
          }}
        >

          <button
            onClick={onCancel}
            style={{
              padding:"8px 14px",
              borderRadius:"6px",
              border:"1px solid #e2e8f0",
              background:"white",
              cursor:"pointer"
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding:"8px 14px",
              borderRadius:"6px",
              border:"none",
              background:"#ef4444",
              color:"white",
              cursor:"pointer"
            }}
          >
            {confirmText}
          </button>

        </div>
      </div>
    </div>
  )
}