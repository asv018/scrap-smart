import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function GarbageComplain() {
  const [complainList, setComplainList] = useState([]);
  useEffect(() => {
    getDocs(collection(db, `db/complain/list`)).then((_snapShot: any) => {
      let data: any = [];
      _snapShot?.forEach((doc: any) => {
        data.push({ docId: doc.id, ...doc.data() });
      });
      console.log(data);
      setComplainList(data);
    });
  }, []);
  return (
    <>
      <h1 className="text-3xl font-bold my-6">Unsolved complains</h1>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
        {complainList?.map((complain: any) => {
          if (complain.isSolved == false)
            return (
              <>
                <Link href={`/municipal/complain/${complain.docId}`}>
                  <div className="px-2 py-2 rounded-md shadow-lg ">
                    <h1 className="font-bold">
                      {" "}
                      {complain.firstName} {complain.lastName}
                    </h1>
                    <p>{complain.desc.slice(0, 40)}...</p>
                  </div>
                </Link>
              </>
            );
        })}
      </div>
      <h1 className="text-3xl font-bold my-6">Solved complains</h1>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
        {complainList?.map((complain: any) => {
          if (complain.isSolved == true)
            return (
              <>
                <Link href={`/municipal/complain/${complain.docId}`}>
                  <div className="px-2 py-2 rounded-md shadow-lg ">
                    <h1 className="font-bold">
                      {" "}
                      {complain.firstName} {complain.lastName}
                    </h1>
                    <p>{complain.desc.slice(0, 40)}...</p>
                  </div>
                </Link>
              </>
            );
        })}
      </div>
    </>
  );
}

export default GarbageComplain;
