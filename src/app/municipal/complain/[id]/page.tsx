"use client";
import MunicipalNavbar from "@/components/municiple/municiple-navbar";
import { auth, db } from "@/firebase/config";
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
import { Check, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [complainData, setcomplainData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, userLoading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<any>();
  useEffect(() => {
    getDocs(collection(db, `db/local_user/${complainData?.email}`)).then(
      (querySnapshot: any) => {
        let arr: any = [];
        querySnapshot.forEach((doc: any) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setUserData(arr[0]);
      }
    );
  }, [complainData]);
  useEffect(() => {
    const q = query(
      collection(db, "db/complain/list"),
      where(documentId(), "in", [id])
    );
    setLoading(true);
    getDocs(q).then((_snapshot: any) => {
      let data: any = [];
      _snapshot.forEach((doc: any) => {
        data.push({ docId: doc.id, ...doc.data() });
      });
      setcomplainData(data[0]);
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
  const onSolved = () => {
    const docRef = doc(db, "db/complain/list", id);
    let promise = new Promise((resolve, reject) => {
      updateDoc(docRef, {
        isSolved: true,
      })
        .then(() => {
          addDoc(
            collection(
              db,
              `db/local_user/${complainData.email}/${userData.id}/coin`
            ),
            {
              timestamp: serverTimestamp(),
              coin: 5,
            }
          ).then(() => {
            location.reload();
            resolve("Complain solved");
          });
          // location.reload();

          // resolve("Done");

          //   window.
          //   router;
        })
        .catch((err) => {
          reject("Try again");
        });
    });
    toast.promise(promise, {
      loading: "Solving...",
      error: "Please try again",
      success: "Complain solved successfully",
    });
  };
  return (
    <>
      <div>
        <MunicipalNavbar />
        {/* {id} */}
        <div className="max-w-4xl mx-auto px-2 mt-6">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">
              {complainData.firstName} {complainData.lastName}
            </h1>
            {complainData.isSolved ? (
              <>
                <button className="flex items-center gap-2 px-2 py-2 bg-green-600 text-white">
                  <Check />
                  Solved
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onSolved}
                  className="flex items-center gap-2 px-2 py-2 bg-red-600 text-white"
                >
                  <XCircle />
                  Unsolved
                </button>
              </>
            )}
            <button></button>
          </div>
          <p className="my-2">Email: {complainData.email}</p>
          <p className="my-2">Phone: {complainData.phone}</p>
          <p>Problem description : {complainData.desc}</p>
          <p>
            Address : {complainData.streetAddress} {complainData.state}{" "}
            {complainData.pincode}
          </p>
          <div className="grid my-6 md:grid-cols-4 grid-cols-2 gap-3">
            {complainData.images.map((img: any) => {
              return (
                <>
                  <img
                    src={img}
                    className="h-60 hover:scale-125 duration-200 object-contain "
                    alt=""
                  />
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
