"use client";
import { Button } from "@nextui-org/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "@nextui-org/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import "./styles.css";
import { Pagination } from "swiper/modules";
import HomeNavbar from "@/components/navbar";
import UserLogin from "@/components/home/user-login";
import MunicipalityLogin from "@/components/home/municipality-login";
import ScrapCollectorLogin from "@/components/home/scrap-collector-login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/config";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState();
  useEffect(() => {
    getDocs(collection(db, `db/local_user/${user?.email}`)).then(
      (querySnapshot: any) => {
        let arr: any = [];
        querySnapshot.forEach((doc: any) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setUserData(arr[0]);
      }
    );
  }, [user]);
  return (
    <>
      <div className="px-5 pt-10 lg:px-20">
        {/* <HomeNavbar /> */}
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

        <div className="mt-10 flex flex-col justify-center max-w-2xl space-y-5 mx-auto ">
          <UserLogin userData={userData} />
          <ScrapCollectorLogin userData={userData} />
          <MunicipalityLogin userData={user} />
        </div>
      </div>
    </>
  );
}
