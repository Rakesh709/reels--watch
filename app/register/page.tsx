"use client"

import { useRouter } from 'next/navigation'
import React,{useState} from 'react'

function Register() {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const [error, setError] = useState("")

   const router=  useRouter()
    //with this we can push user anywhere

    router.push("/login")
    //this will redirect to login route

    const handleSubmit=  async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        if(password !== confirmPassword){
            setError("Your password does not match")
        }

        try {
          const res =  await fetch("/api/auth/register",{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify({email,password})
          })

          const data = res.json();
          if(!res.ok){
                setError("Registeration failed")
          }

          router.push("/login")

        } catch (error) {
            setError("Failed in Registration")
        }
    }

  return (
    <div> Register</div>
  )
}

export default Register