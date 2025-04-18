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
export async function uploadData(info: AthleteData) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from('athlete')
      .insert(info);
  
    if (error) {
      console.error("Insert failed:", JSON.stringify(error, null, 2));
    } else {
      console.log("Insert succeeded:", data);
    }
  
    return { data, error };
  }
  