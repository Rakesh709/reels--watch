//centralised featch 

import { IVideo } from "@/models/Video";

export type videoFormData = Omit<IVideo,"_id">



type FetchOptions={
    method?: "GET" | "POST" | "PUT" |"DELETE";
    body?:any;
    headers?: Record<string,string>
}


class ApiClient{
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions ={}
    ): Promise<T>{
        const {method= "GET",body,headers={}} = options

        const defaultHeaders= {
            "Content-Type": "application/json",
            ...headers
        }

       const response =  await fetch(`/api${endpoint}`,{
            method,
            headers:defaultHeaders,
            body:body ? JSON.stringify(body) : undefined
        })
        if(!response.ok){
            throw new Error(await response.text());
      }

      return response.json()
    }

    //method 

    async getVideos(){
        return this.fetch<IVideo[]>("/videos")
        //in return we will get complete response 
    }

    async getAVideos(id:string){
        return this.fetch<IVideo>(`/videos/${id}`);
    }

    async createVideo(videoData:videoFormData) {
        return this.fetch("/videos",{
            method:"POST",
            body:videoData
        })
    }
}

export const apiClient = new ApiClient()

// GENERIC IN TYPESCRIP
//Record<string,string>: key value pair