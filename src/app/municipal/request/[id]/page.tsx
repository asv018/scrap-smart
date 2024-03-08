"use client";
import MunicipalNavbar from "@/components/municiple/municiple-navbar";
import { auth, db } from "@/firebase/config";
import { update } from "firebase/database";
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Check, CrossIcon, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id);
  const [scrapData, setScrapData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, userLoading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<any>();
  useEffect(() => {
    getDocs(collection(db, `db/local_user/${scrapData?.email}`)).then(
      (querySnapshot: any) => {
        let arr: any = [];
        querySnapshot.forEach((doc: any) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setUserData(arr[0]);
      }
    );
  }, [scrapData]);
  useEffect(() => {
    const q = query(
      collection(db, "db/request/list"),
      where(documentId(), "in", [id])
    );
    setLoading(true);
    getDocs(q).then((_snapshot: any) => {
      let data: any = [];
      _snapshot.forEach((doc: any) => {
        data.push({ docId: doc.id, ...doc.data() });
      });
      setScrapData(data[0]);
      setLoading(false);
    });
  }, [id]);
  if (userLoading) {
    return (
      <div className="flex h-screen justify-center items-center flex-col">
        <Loader2 className="animate-spin" />
        <p className="mt-2">Loading page</p>
      </div>
    );
  }
  if (!user) {
    router.push("/");
    return;
  }

  if (loading) {
    return (
      <>
        <div className="h-screen flex items-center justify-center flex-col">
          <Loader2 className="animate-spin" />
          <span className="mt-2">Loading page</span>
        </div>
      </>
    );
  }
  const onVerify = () => {
    // console.log(`db/local_user/${scrapData.email}/${userData.id}/coin`);
    // return ;
    const docRef = doc(db, "db/request/list", id);
    let promise = new Promise((resolve, reject) => {
      updateDoc(docRef, {
        verified: true,
      })
        .then(() => {
          addDoc(
            collection(
              db,
              `db/local_user/${scrapData.email}/${userData.id}/coin`
            ),
            {
              timestamp: serverTimestamp(),
              coin: 5,
            }
          ).then((res) => {
            location.reload();
            resolve("Done");
          });

          //   window.
          // router;
        })
        .catch((err) => {
          reject("Try again");
        });
    });
    toast.promise(promise, {
      loading: "Verifing...",
      error: "Please try again",
      success: "Request verified successfully",
    });
  };
  return (
    <div className="">
      <MunicipalNavbar />
      <div className="max-w-4xl mx-auto px-3 mt-6 ">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">{scrapData.name}</h1>
          {scrapData.verified === false ? (
            <>
              <button
                onClick={onVerify}
                className="px-2 text-white bg-red-600 py-2 flex gap-2"
              >
                <XCircle />
                Please verify
              </button>
            </>
          ) : (
            <>
              <div className="px-2 text-white bg-green-600 py-2 flex gap-2">
                <Check />
                Verified
              </div>
            </>
          )}
        </div>
        <p className="my-2">Email: {scrapData.email}</p>
        <p className="my-2">Phone: {scrapData.phone}</p>
        <p className="my-2">Address: {scrapData.address}</p>
        <div className="grid my-10 md:grid-cols-4 grid-cols-2 gap-3">
          {scrapData.images?.map((image: any) => {
            return (
              <>
                <div className="">
                  <img
                    src={image}
                    className="h-full hover:scale-125 duration-200 object-contain hover:cursor-pointer w-full"
                    alt=""
                  />
                </div>
              </>
            );
          })}
        </div>
        {/* <div className="my-6">
        <iframe src="https://www.google.com/maps/embed/v1/place?q=neemkathana+rajasthan" width="600" height="450" loading="lazy" ></iframe>
        </div> */}
      </div>
    </div>
  );
}

export default Page;
