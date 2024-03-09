"use client";
import ScrapNavbar from "@/components/scrap-collector/scrap-navbar";
import { db } from "@/firebase/config";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id);
  const [scrapData, setScrapData] = useState<any>();
  const [loading, setLoading] = useState(true);
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
  return (
    <div>
      <ScrapNavbar />
      <div className="max-w-4xl mx-auto px-3 mt-6 ">
        <h1 className="text-3xl font-bold">{scrapData.name}</h1>
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
