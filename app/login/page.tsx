"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export default function LoginPage(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

async function handleLogin(e: React.FormEvent){

e.preventDefault()
setMessage("")
setLoading(true)

try{

const response = await fetch(`${API_URL}/auth/login`,{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded"
},
body:new URLSearchParams({
username: email,
password: password
})
})

if(!response.ok){
throw new Error("Email ou senha inválidos")
}

const data = await response.json()

localStorage.setItem("token", data.access_token)

router.push("/dashboard")

}catch(error:any){
setMessage(error.message)
}

setLoading(false)
}

return(

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#f5f6fa"
}}>

<form
onSubmit={handleLogin}
style={{
width:"400px",
background:"#fff",
padding:"30px",
borderRadius:"12px",
boxShadow:"0 10px 30px rgba(0,0,0,0.1)"
}}
>

<h1 style={{fontSize:"22px",marginBottom:"5px"}}>
Horvex
</h1>

<p style={{color:"#666",marginBottom:"20px"}}>
Sistema de agendamento
</p>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={input}
/>

<input
type="password"
placeholder="Senha"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={input}
/>

<button
type="submit"
style={button}
disabled={loading}
>
{loading ? "Entrando..." : "Entrar"}
</button>

{message && (
<p style={{color:"red",marginTop:"10px"}}>
{message}
</p>
)}

</form>

</div>

)

}

const input = {
width:"95%",
padding:"10px",
marginBottom:"12px",
borderRadius:"6px",
border:"1px solid #ccc"
}

const button = {
  display: "block",
  width: "60%",       // 👈 controla o tamanho
  margin: "10px auto 0", // 👈 centraliza horizontalmente
  padding: "12px",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
}
