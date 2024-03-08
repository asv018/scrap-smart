"use client";
import ScrapNavbar from "@/components/scrap-collector/scrap-navbar";
import { auth, db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function Page() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [scrapReqeust, setScrapReqeust] = useState([]);

  useEffect(() => {
    getDocs(collection(db, `db/request/list`)).then((_snapshot: any) => {
      let data: any = [];
      _snapshot.forEach((doc: any) => {
        console.log(doc.id);
        data.push({ docId: doc.id, ...doc.data() });
      });
      console.log(data);
      setScrapReqeust(data);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
        <p className="mt-2">Loading page</p>
      </div>
    );
  }
  if (!user) {
    router.push("/");
    return;
  }
  return (
    <div>
      <ScrapNavbar />
      <div className="mx-auto max-w-4xl  my-10">
        <h1 className="text-3xl font-bold my-6">Available scrap requests</h1>
        <div className="grid md:grid-cols-4 grid-cols-2 px-3 gap-3">
          {scrapReqeust?.map((scrap: any) => {
            return (
              <Link href={`/scrap-collector/${scrap.docId}`}>
                <div className="rounded-lg flex shadow-lg px-2 py-2">
                  <div>
                    <h1 className="font-bold">{scrap.wasteName}</h1>
                    <p>By: {scrap.name}</p>
                  </div>
                  <div>
                    <Check className="text-green-600" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Page;
