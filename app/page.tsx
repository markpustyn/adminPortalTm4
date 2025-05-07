'use client'
import Image from "next/image";
import { useRef, ChangeEvent, useState, useTransition } from "react";
import { convert } from "./lib/utils";
import {  uploadImage } from "./supabase/storage/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Athletes from "./athletes";

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

export default function Home() {
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const imgInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useTransition();
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
  } = useForm<AthleteData>()
  const router = useRouter()

  const handleImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const newImageUrl = filesArr.map((file) => URL.createObjectURL(file));
      setImgUrl((prev) => [...prev, ...newImageUrl]);
    }
  };
  const onSubmit: SubmitHandler<AthleteData> = async (info) =>  {
    try{
      setLoading(async () => {
        if(!imgUrl.length) return
          const imageFile = await convert(imgUrl[0]);
          const { imgUrl: uploadedUrl, error } = await uploadImage({
            file: imageFile,
            bucket: 'athleateimg',
            info
          });
          if (!error){
            setImgUrl([uploadedUrl]);
            setSuccess(true)
            toast("Athlete Added Successfully") 
            router.refresh()
          } else {
            toast("An Error Has Occured")
          }
      });
    } catch {
      toast("An Error Has Occured")
    }
  }



  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6 flex-col">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Upload Athlete Images</h1>
        </div>
          <h2 className="text-2xl font-semibold mb-4">Player Info</h2>
          <form className="grid grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-md max-w-3xl" 
          onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input {...register('name')} type="text" placeholder="Name" required/>
            </div>
            <div>
              <Label htmlFor="school">School</Label>
              <Input {...register('school')} type="text" placeholder="School" />
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input {...register('weight')} type="number" placeholder="Weight (lbs)" />
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Input {...register('class')} type="text" placeholder="Class" />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input {...register('height')} type="text" placeholder={`5' 12"`} required/>
            </div>
            <div>
              <Label htmlFor="interests">Interests</Label>
              <Input {...register('interests')}  type="text" placeholder="Interests" />
            </div>
            <div>
              <Label htmlFor="sport">Sport</Label>
              <Input {...register('sport')} type="text" placeholder="Football" required/>
            </div>
            <div>
              <Label htmlFor="social">Social Media</Label>
              <Input {...register('socialMedia')} type="text" placeholder="@username or link" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="stats">Stats</Label>
              <Input {...register('stats')} type="text" placeholder="Stats" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea {...register('summary')} placeholder="Brief player summary..." rows={4} />
            </div>
            <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Label htmlFor="picture">Select Image (Compressed Images Recommended)</Label>
            
            <Input
              id="picture"
              type="file"
              ref={imgInput}
              onChange={handleImg}
              disabled={loading}
            />
          </div>
{/* 
          {imgUrl.length > 0 && (
            <div className="text-center">
              <Button
                onClick={handleUpload}
                className="mt-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-xl transition"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          )} */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imgUrl.map((url) => (
            <div key={url} className="rounded-lg overflow-hidden shadow-md border bg-white p-2">
              <Image
                src={url}
                width={300}
                height={300}
                alt="Athlete"
                className="rounded-md object-cover w-full h-auto"
              />
            </div>
          ))}
          {success === true && (
            <div className="text-center text-green-500 font-semibold border-2 border-green-500 rounded-xl">
              Image Uploaded Successfully!
            </div>
          )}
        </div>
        <Button type="submit">Submit</Button>
      </form>
      <Athletes/>
        </div>
    </main>
  );
}