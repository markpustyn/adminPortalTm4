import { v4 as uuidv4 } from "uuid";
import imageCompression from 'browser-image-compression';
import { createClient } from '@/app/supabase/client';

function getStorage(){
    const {storage} = createClient()
    return storage
}

type UploadProps = {
    file: File;
    bucket: string;
    folder?: string;
}
export async function uploadImage({file, bucket, folder}: UploadProps){
    const fileName = file.name
    const fileExten = fileName.slice(fileName. lastIndexOf(".") + 1)
    const path =  `${folder ? folder + "/" : ""}${uuidv4()}.${fileExten}`

    try{
        file = await imageCompression(file, {
            maxSizeMB: 1000
        }) 
    } catch {
        console.error("image compreesion failed")
    }
    const storage = getStorage()

    const {data, error} = await storage.from(bucket).upload(path, file)
    if(error){
        console.error(error)
    }
    const imgUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/
    object/public/${bucket}/${data?.path}`

    return {imgUrl, error: ""}
}