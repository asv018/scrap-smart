"use client";
import UserNavbar from "@/components/user/navbar";
import { auth, db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { GitPullRequest, Loader2, RatIcon, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Button } from "@nextui-org/react";
import RateCartModal from "@/components/user/scrap-request/rate-cart-modal";
import { wasteList } from "@/lib/waste-product-list";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState();
  const [loadingUserData, setLoadingUserData] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setLoadingUserData(true);
    getDocs(collection(db, `db/local_user/${user?.email}`)).then(
      (querySnapshot: any) => {
        let arr: any = [];
        querySnapshot.forEach((doc: any) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setUserData(arr[0]);
        setLoadingUserData(false);
      }
    );
  }, [user]);
  if (loading || loadingUserData) {
    return (
      <>
        <div className="h-screen flex flex-col items-center justify-center">
          <Loader2 className="animate-spin" />
          <span className="mt-2">Loading page</span>
        </div>
      </>
    );
  }
  if (!user || !userData) {
    toast.error("Please login as user");
    router.push("/");
  }
  return (
    <>
      <UserNavbar />
      <div className="max-w-3xl px-4 mx-auto ">
        <h1 className="mt-6 font-bold text-3xl">
          What would you like to sell ?
        </h1>
        <div className="grid gap-3 my-10 lg:grid-cols-4 grid-cols-3">
          {wasteList.map((e: any) => {
            return (
              <>
                <div className="flex flex-col items-center ">
                  <img src={e.img} className="h-24 w-24 rounded-full" alt="" />
                  <h1 className="text-center mt-1">{e.shortDesc}</h1>
                </div>
              </>
            );
          })}
        </div>
        <h1 className="my-6 font-bold text-3xl">Society Campaigns</h1>
        <div className="h-80 w-160">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
            // className="mySwiper"
          >
            <SwiperSlide>
              <img
                className="w-40"
                src="https://www.adgully.com/img/800/202312/untitled-design-9.png.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="w-40"
                src="https://www.undp.org/sites/g/files/zskgke326/files/2023-03/3_2.png"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="w-40"
                src="https://storage.googleapis.com/adforum-media/34567530/ad_34567530_ab817221712d5b91_web.jpg"
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="my-20 grid grid-cols-2 gap-4">
          <RateCartModal userData={userData} />
          <Button
            onClick={() => {
              router.push("/user/scrap-request/raise-request");
            }}
            startContent={<GitPullRequest />}
          >
            Raise Request
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page;
