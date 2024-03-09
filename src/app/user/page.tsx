"use client";
import { auth, db } from "@/firebase/config";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "@nextui-org/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import "./styles.css";
import { Pagination } from "swiper/modules";
import UserNavbar from "@/components/user/navbar";
import { useRouter } from "next/navigation";
import ComplainCard from "@/components/user/complain-card";
import ScrapRequestCard from "@/components/user/scrap-request-card";
import { Tweet } from "react-tweet";
import { collection, getDocs } from "firebase/firestore";
function Page() {
  const [video, setVideo] = useState([
    "https://youtube.com/embed/7SCBdcXg2fs",
    "https://youtube.com/embed/29OFyXJC_uA",
    "https://youtube.com/embed/JlbbVGPATgA",
  ]);
  const [reviews, setReviews] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    getDocs(collection(db, `db/review/list`)).then((_snapshot: any) => {
      let data: any = [];
      _snapshot.forEach((doc: any) => {
        console.log(doc.id);
        data.push({ id: doc.id, ...doc.data() });
      });
      console.log(data);
      setReviews(data);
    });
  }, []);
  if (loading) {
    return (
      <>
        <div className="flex items-center h-screen flex-col justify-center">
          <Loader2Icon className="animate-spin " />
          <span className="mt-2 ">Loading page</span>
        </div>
      </>
    );
  }
  if (!user) {
    router.push("/");
    return;
  }
  return (
    <div className="px-5 lg:px-20">
      <UserNavbar />
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
        loop={true}
      >
        {Array(10)
          .fill(0)
          .map((slider: any) => {
            return (
              <>
                <SwiperSlide>
                  <div className="w-full md:h-[20rem] h-[10rem] lg:h-[40rem]">
                    <img
                      className="w-full hover:scale-125 overflow-hidden duration-300 h-20"
                      src="https://www.hindustantimes.com/ht-img/img/2023/03/29/1600x900/Waste-management-is-a-critical-issue-in-India--wit_1680104696239.jpg"
                      alt=""
                    />
                  </div>
                </SwiperSlide>
              </>
            );
          })}
      </Swiper>
      <div className="my-20 grid md:grid-cols-2 grid-cols-1 mx-auto gap-4  max-w-6xl  ">
        <ComplainCard />
        <ScrapRequestCard />
      </div>
      <h1 className="text-center text-3xl mt-40 lg:text-5xl font-bold">
        How our app works ?
      </h1>
      <div className="my-20 grid md:grid-cols-3 grid-cols-1 gap-5">
        {video.map((video) => {
          return (
            <>
              <div className=" border">
                <iframe
                  className="w-full h-[20vh] md:h-[30vh]"
                  src={video}
                  allow="autoplay; fullscreen; picture-in-picture"
                ></iframe>
              </div>
            </>
          );
        })}
      </div>
      <h1 className="text-center text-3xl mt-40 lg:text-5xl font-bold">
        Public reviews are awesome
      </h1>
      <div className="my-10 grid gap-3 md:grid-cols-4 grid-cols-1">
        {reviews.map((rev: any) => {
          return (
            <div className="rounded-md px-2 py-2 shadow-lg">
              <h1 className="font-bold">{rev.name}</h1>
              <p>{rev.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
