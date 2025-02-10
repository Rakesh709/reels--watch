import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//JITNE MBHI VIDEO HAI USKI LEKR AYOO AND PASS ON KR DO
//get method gor video /api/video-- api route
export async function GET() {
    try {
        await connectToDatabase();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch video" }, { status: 200 })
    }
}

//post method to post video
//POST(requesst:NextRequest) : request sai data exteract krna hai
export async function POST(request: NextRequest) {
    try {
        //from the next side we gor this method
        const session = await getServerSession(authOptions)

        //if not login
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectToDatabase()
        const body: IVideo = await request.json()

        if (!body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl) {
            return NextResponse.json({ error: "Required field missing" }, { status: 400 })
        }
        //ager sab value agya hai to default value ham config kr dete hai baki sab asi he krte hai

        const videoData= {
            ...body,
            controls: body.controls ?? true,
            transformation :{
                height:1920,
                width:1080,
                quality:body.transformation?.quality??100
            }
        }

        //new model for mongoees 
        const newVideo = await Video.create(videoData);
        return NextResponse.json(newVideo)

    } catch (error) {
        return NextResponse.json({ error: "Failed to create a video" }, { status: 400 })
    }
}