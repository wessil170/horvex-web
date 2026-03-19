export function corServico(nome: string) {

  if (!nome) return "#64748b"

  let hash = 0

  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = Math.abs(hash % 360)

  return `hsl(${hue}, 65%, 55%)`

}