import { Connection } from "mongoose"

declare global {
    var mongoose:{
        conn: Connection | null
        promise :Promise<Connection> | null
    }
}

export {};

//var is only dedlared 

//this is because of typescript or else not required