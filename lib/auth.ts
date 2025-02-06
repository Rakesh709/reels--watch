import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs"



export const authOptions: NextAuthOptions={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password")
                }

                try {
                    //for the edge condition
                    await connectToDatabase()
                   const user= await User.findOne({email:credentials.email})

                    if(!user){
                        throw new Error("No User Found")
                    }

                   const isValid= await bcrypt.compare(
                        credentials.password,user.password
                    )

                    if(!isValid){
                        throw new Error("Invalid Password")
                    }

                    //if password matches maje he maje 
                    //return a object
                    //is mai jo value daloge wo session mai chali jati hai
                    return {
                        id:user._id.toString(),
                        email:user.email
                    }

                    //you will get every thing in session

                } catch (error) {
                    throw error
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id= user.id
            }
            return token
        },
        //if we are getting any value we will get the user and make it login
        async session({session,token}){

            if(session.user){
                session.user.id= token.id as string
            }

            return session
        }
    },
    pages:{
        signIn:"/login",
        error: "./login"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60
    },
    secret:process.env.NEXTAUTH_SECRET
}












// strategy as database bhi hota hai ki session database mai store krna hai ya token

//ager custom credential kroge to krna hi krna hai
// async session({session,token}){

//     if(session.user){
//         session.user.id= token.id as string
//     }

//     return session
// }