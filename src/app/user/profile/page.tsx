"use client";
import UserNavbar from "@/components/user/navbar";
import { auth, db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { DeleteIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function Page() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<any>();
  const [reqeustList, setRequestList] = useState([]);
  const [complainList, setComplainList] = useState([]);
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
    getDocs(collection(db, `db/request/list`)).then((querySnapshot: any) => {
      let arr: any = [];
      querySnapshot.forEach((doc: any) => {
        arr.push({ docId: doc.id, ...doc.data() });
      });
      //   setUserData(arr[0]);
      setRequestList(arr);
    });
  }, [userData]);
  useEffect(() => {
    getDocs(collection(db, `db/complain/list`)).then((querySnapshot: any) => {
      let arr: any = [];
      querySnapshot.forEach((doc: any) => {
        arr.push({ docId: doc.id, ...doc.data() });
      });
      //   setUserData(arr[0]);
      setComplainList(arr);
    });
  }, []);
  const deleteReqeuest = (docId: any) => {
    console.log(docId);
  };
  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <Loader2 className="animate-spin" />
        <span className="my-2">Loading page</span>
      </div>
    );
  }
  if (!user) {
    router.push("/");
    return;
  }
  return (
    <>
      <div>
        <UserNavbar />
        <div className="px-2 mx-auto max-w-4xl my-4">
          <h1 className="text-3xl font-bold">Your verified requests</h1>
          <div className="grid mt-6 md:grid-cols-4 grid-cols-2 gap-3">
            {reqeustList.map((request: any) => {
              if (request.verified === true && request.email === user.email)
                return (
                  <>
                    <div className="px-2 flex py-2 shadow-lg rounded-lg">
                      <div className="w-12/12">
                        <h1 className="font-bold">{request.wasteName}</h1>
                        <p>
                          {request.product.map((product: any) => {
                            return product.name;
                          })}
                        </p>
                      </div>
                      <div>
                        {/* <button
                        onClick={() => {
                          deleteReqeuest(request.docId);
                        }}
                      >
                        <DeleteIcon className="text-red-600" />
                      </button> */}
                      </div>
                    </div>
                  </>
                );
            })}
          </div>
          <h1 className="text-3xl mt-6 font-bold">Your unverified requests</h1>
          <div className="grid mt-6 md:grid-cols-4 grid-cols-2 gap-3">
            {reqeustList.map((request: any) => {
              if (request.verified === false && request.email === user.email)
                return (
                  <>
                    <div className="px-2 flex py-2 shadow-lg rounded-lg">
                      <div className="w-12/12">
                        <h1 className="font-bold">{request.wasteName}</h1>
                        <p>
                          {request.product.map((product: any) => {
                            return product.name;
                          })}
                        </p>
                      </div>
                      <div>
                        {/* <button
                        onClick={() => {
                          deleteReqeuest(request.docId);
                        }}
                      >
                        <DeleteIcon className="text-red-600" />
                      </button> */}
                      </div>
                    </div>
                  </>
                );
            })}
          </div>
          <h1 className="text-3xl mt-6 font-bold">Your solved complain</h1>
          <div className="grid mt-6 md:grid-cols-4 grid-cols-2 gap-3">
            {complainList.map((request: any) => {
              if (request.isSolved === true && request.email === user.email)
                return (
                  <>
                    <div className="px-2 flex py-2 shadow-lg rounded-lg">
                      <div className="w-12/12">
                        <h1 className="font-bold">{request.name}</h1>
                        <p>{request.desc}</p>
                      </div>
                      <div>
                        {/* <button
                        onClick={() => {
                          deleteReqeuest(request.docId);
                        }}
                      >
                        <DeleteIcon className="text-red-600" />
                      </button> */}
                      </div>
                    </div>
                  </>
                );
            })}
          </div>
          <h1 className="text-3xl mt-6 font-bold">Your unsolved complain</h1>
          <div className="grid mt-6 md:grid-cols-4 grid-cols-2 gap-3">
            {complainList.map((request: any) => {
              if (request.isSolved === false && request.email === user.email)
                return (
                  <>
                    <div className="px-2 flex py-2 shadow-lg rounded-lg">
                      <div className="w-12/12">
                        <h1 className="font-bold">{request.wasteName}</h1>
                        <p>{request.desc}</p>
                      </div>
                      <div>
                        
                      </div>
                    </div>
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
