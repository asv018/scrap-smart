import { db } from "@/firebase/config";
import { collection, getDocs, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
function Request() {
  //   const [reqeustList, setRequestList] = useState([]);
  const q = query(collection(db, `db/request/list`));
  const [_snapshot, chatLoading, chatError] = useCollection(q);
  const request: any = _snapshot?.docs?.map((doc: any) => ({
    docId: doc.id,
    ...doc.data(),
  }));
  console.log(request);

  return (
    <div className="mx-auto px-3 mt-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Unverified requests</h1>
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-3">
        {request?.map((req: any) => {
          if (req.verified == false) {
            return (
              <>
                <Link href={`/municipal/request/${req.docId}`}>
                  <div className="px-2 shadow-lg flex py-2 rounded-lg">
                    <div className="">
                      <h1 className="fond-bold">{req.wasteName}</h1>
                      <span>By: {req.name}</span>
                    </div>
                  </div>
                </Link>
              </>
            );
          }
          return <></>;
        })}
      </div>
      <h1 className="text-3xl font-bold mt-10 mb-2">Verified requests</h1>
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-3">
        {request?.map((req: any) => {
          if (req.verified == true) {
            return (
              <>
                <Link href={`/municipal/request/${req.docId}`}>
                  <div className="px-2 shadow-lg flex py-2 rounded-lg">
                    <div className="">
                      <h1 className="fond-bold">{req.wasteName}</h1>
                      <span>By: {req.name}</span>
                    </div>
                  </div>
                </Link>
              </>
            );
          }
          return <></>;
        })}
      </div>
    </div>
  );
}

export default Request;
