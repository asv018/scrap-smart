"use client";
import MunicipalNavbar from "@/components/municiple/municiple-navbar";
import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Request from "@/components/municiple/request";
import GarbageComplain from "@/components/municiple/garbage-complain";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  if (loading) {
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

  return (
    <div>
      <MunicipalNavbar />
      <div className="my-6 max-h-24 px-3 max-w-4xl mx-auto">
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab key="photos" title="Garbage Complain">
              <GarbageComplain />
            </Tab>
            <Tab key="music" title="Request">
              <Request />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Page;
