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
type AthleteData = {
    name?: string;
    school?: string;
    weight?: string;
    profileImg?: string;
    class?: string;
    height?: string;
    interests?: string;
    sport?: string;
    socialMedia?: string;
    stats?: string;
    summary?: string;
}
export async function uploadImage({file, bucket, folder, info}: UploadProps & {info: AthleteData}){
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

    const {data: uploadData, error: uploadError} = await storage
        .from(bucket)
        .upload(path, file)
    const imgUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/
    object/public/${bucket}/${uploadData?.path}`

    const supabase = createClient();
    info['profileImg'] = imgUrl

    const { data, error } = await supabase
      .from('athlete')
      .insert(info)
      .select()
      
    return {imgUrl, uploadError, data, error}
}
export async function fetchData() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('athlete')
      .select("*")
  
    return { data, error };
  }