"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import {Loader2} from "lucide-react"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

//for typescript

interface FileUploadProps{
    onSuccess: (res:IKUploadResponse) =>void
    onProgress?: (progress:number) => void
    fileType?: "image" | "video"
}
//whent to use \\ or \ line

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType="image"
}:FileUploadProps) {

  const [uploading,setUploading] = useState(false)
  const [erorr,setError] = useState<string| null>(null)

  const onError = (err:{message:string}) => {
    console.log("Error", err);
    setError(err.message)
    setUploading(false)
  };
  
  const handleSuccess = (response:IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false)
    setError(null)
    onSuccess(response)
  };
  
  const handleProgress = (evt:ProgressEvent) => {
    if(evt.lengthComputable && onProgress){
        const percentComplete =(evt.loaded /evt.total)*100;
        onProgress(Math.round(percentComplete));
    }
  };
  
  const handleStartUpload = () => {
    setUploading(true)
    setError(null)
  };

  //for file handling  file valid method
  const validateFile =(file:File)=>{
    if(fileType==="video"){
            if(!file.type.startsWith("video/")){
                setError("Please Upload a video File")
                return false
            }
            if(file.size>100*1024*1024){
                setError('Video must be less than 100MB')
                return false
            }
    }else{
        const validType = ["image/jpeg","image/png","image/webp"]
        if(!validType.includes(file.type)){
            setError("Please upload a valid file(JPEG,WEBPF,PNG")
            return false
        }
        if(file.size>5*1024*1024){
            setError('Image must be less than 5MB')
            return false
        }
    }
    return false
    
  }


  return (
    <div className="space-y-2">
      
        <IKUpload
          fileName={fileType==="video"?"video":"image"}
          onError={onError}
          useUniqueFileName={true}
          validateFile={validateFile}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          folder={fileType==="video" ? "/videos":"/images"}  
          className="file-input file-input-bordered w-full"
          accept={fileType==="video" ? "video/*" : "image/*"}
        />
    </div>
  );
}