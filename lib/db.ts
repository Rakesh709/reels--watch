import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define mongodb uri in env file")
}

let cached = global.mongoose;


//if the cached  (edge) is not present then cached it at someedge location
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase(){
    //ager coonetion nhi hai to kr do 
    if(cached.conn){
        return cached.conn
    }

    //agrer promise nhi hai to kr do promise create
    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize:10
        }
        
        cached.promise= mongoose
        .connect(MONGODB_URI,opts)
        .then(()=> mongoose.connection)
    }

    //ager promise chal rha hai to kr do
    //thoda sai wait kr lo

    try {
        cached.conn = await cached.promise
    } catch (error) {
        //jo mamla chal rha hai to usko phek do
        cached.promise = null
        throw new Error("Check database")
    }

    return cached.conn;

}

//maxPoolSize : how many connection chahte ho at a time 
//bufferCommands ?