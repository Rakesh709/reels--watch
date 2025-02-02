import mongoose, { model, Schema,models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updateAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

//save krne sai pehle eek pre hook chalao 
userSchema.pre("save",async function (next){
    //pre hook jab chalega jab password field modefied hua hai
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})
//ager forgot password hua hai to bhi krna hai 

// export User = model("User",userSchema)
//this is normal scenario


const User = models?.User || model<IUser>("User",userSchema)

export default User;
