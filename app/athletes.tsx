"use client";
import { useEffect, useState } from "react";
import { fetchData } from "./supabase/storage/client";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


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

export default function Athletes() {
  const [data, setData] = useState<AthleteData[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await fetchData();
      if (error) console.error(error);
      else setData(data || []);
    }
    load()
  }, []);
  

  

  return (
    <div>
    <h2 className="text-2xl text-center mb-4 font-bold">Athletes</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {data.map((athlete, index) => (
    <Card key={index}>
        <CardHeader>
            <CardTitle>{athlete.name || "Card Title"}</CardTitle>
              <CardDescription>{athlete.school || "Card Description"}</CardDescription>
            </CardHeader>
            <Image
                src={athlete.profileImg.replace(/\s/g, '')}
                alt="Athlete"
                width={300}
                height={300}
                className="rounded"
                />
        </Card>
        ))}
    </div>
    </div>
  );
}
