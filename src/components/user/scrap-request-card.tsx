import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ScrapRequestCard() {
  const router = useRouter();
  return (
    <Card isFooterBlurred radius="lg" className="border-none">
      <img
        alt="Woman listing to music"
        className="object-cover h-full "
        src="https://image.isu.pub/200901112400-45b00bb43aded13767c39e125605d2cb/jpg/page_1_thumb_large.jpg"
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-xl text-black ">Scrap Request</p>
        <Button
          onClick={() => {
            router.push("/user/scrap-request");
          }}
          className="text-tiny text-white bg-black"
          variant="flat"
          color="default"
          radius="lg"
          size="lg"
        >
          Reqeust
        </Button>
      </CardFooter>
    </Card>
  );
}
