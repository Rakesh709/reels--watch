import { NextRequest,NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { error } from "console";
import Email from "next-auth/providers/email";

//function which handle post

export async function POST(request:NextRequest){
    try {
       //email and password nikalo
       const {email,password} = await request.json();

       if(!email || !password){
        return NextResponse.json(
            {error:"Email and password are required"},
            {status:400}
        )
       }
       //database sai puchu user register tha ye nhi
       //ager run hua to databese coonection hoga 
       await connectToDatabase()

      const existingUser=  await User.findOne({email})
      
      //ager user mil gya to error ayega
      if(existingUser){
        return NextResponse.json(
            {error:"Email is alredy register"},
            {status:400}
        );
      }

      //ager user nhi mila to create kro

      await User.create({
        email,
        password
      })

      return NextResponse.json(
        {message:"User register successfully"},
        {status:201}
       ); 


    } catch (error) {
        return NextResponse.json(
            {error:"Failed to register User"},
            {status:500}
           ); 
    }
}

//from the frontend we donlike this 

// const res= fetch("/api/auth.register",{
//     method:"POST",
//     headers:{"Content-Type":"application/json"},
//     body:JSON.stringify({"rock@gmail.com","12345"})
// })

// await res.json()
