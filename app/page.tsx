'use client'
import Image from "next/image";
import { useRef, ChangeEvent, useState, useTransition } from "react";
import { convert } from "./lib/utils";
import { uploadImage } from "./supabase/storage/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const imgInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useTransition();
  const [success, setSuccess] = useState(false)

  const handleImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const newImageUrl = filesArr.map((file) => URL.createObjectURL(file));
      setImgUrl((prev) => [...prev, ...newImageUrl]);
    }
  };

  const handleUpload = async () => {
    setLoading(async () => {
      const urls: string[] = [];
      for (const url of imgUrl) {
        const imageFile = await convert(url);
        const { imgUrl: uploadedUrl, error } = await uploadImage({
          file: imageFile,
          bucket: 'athleateimg',
        });
        if (error){
          console.error(error)
        } else {
          setSuccess(true)
          urls.push(uploadedUrl);
        }
      }
      console.log(urls);
      setImgUrl([]);
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Upload Athlete Images</h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Label htmlFor="picture">Select Image</Label>
            <Input
              id="picture"
              type="file"
              ref={imgInput}
              onChange={handleImg}
              disabled={loading}
            />
            <button
              onClick={() => imgInput.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition"
              disabled={loading}
            >
              Browse Files
            </button>
          </div>

          {imgUrl.length > 0 && (
            <div className="text-center">
              <button
                onClick={handleUpload}
                className="mt-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-xl transition"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          )}
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
      </div>
    </main>
  );
}