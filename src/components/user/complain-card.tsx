'use client'
import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ComplainCard() {
    const router= useRouter();
  return (
    <Card isFooterBlurred radius="lg" className="border-none">
      <img
        alt="Woman listing to music"
        className="object-cover h-full"
        
        src="https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2017_21/2011711/170524-better-argument-1234p.jpg"
      
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-xl text-black ">Garbage Complain</p>
        <Button
        onClick={()=>{
            router.push("/user/garbage-complain")
        }}
          className="text-tiny text-white bg-black"
          variant="flat"
          color="default"
          radius="lg"
          size="lg"
        >
          Complain
        </Button>
      </CardFooter>
    </Card>
  );
}
