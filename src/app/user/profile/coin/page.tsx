"use client";
import UserNavbar from "@/components/user/navbar";
import { auth, db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  //   if(user)
  const [coin, setCoin] = useState(0);
  const [userData, setUserData] = useState<any>();
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
  useEffect(() => {
    getDocs(
      collection(db, `db/local_user/${user?.email}/${userData?.id}/coin`)
    ).then((res) => {
      let totalCoin = 0;
      res.forEach((coin: any) => {
        console.log(coin.data());
        totalCoin += coin.data().coin;
      });

      setCoin(totalCoin);
    });
  }, [userData]);

  if (loading) {
    return (
      <>
        <div className="h-screen w-full flex flex-col items-center justify-center">
          <Loader className="animate-spin" />
          <span className="mt-2">Loading page</span>
        </div>
      </>
    );
  }
  return (
    <div>
      <UserNavbar />
      <div className="mx-auto px-4 flex items-center justify-center h-[90vh] max-w-3xl py-6">
        <h1 className="text-3xl font-medium">
          Your total collected coins - {coin}
        </h1>
      </div>
    </div>
  );
}

export default Page;
