"use client";
import UserNavbar from "@/components/user/navbar";
import { auth, db, storage } from "@/firebase/config";
import validateComplainFormData from "@/lib/validate-complain-form-data";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

function Page() {
  const router = useRouter();
  const [user, loading, error]: any = useAuthState(auth);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [userData, setUserData]: any = useState();
  const [selectedImage, setSelecteImage] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [complainData, setComplainData] = useState<any>({
    firstName: "",
    lastName: "",
    email: user?.email,
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
    desc: "",
  });
  useEffect(() => {
    setLoadingUserData(true);
    getDocs(collection(db, `db/local_user/${user?.email}`)).then(
      (querySnapshot: any) => {
        let arr: any = [];
        querySnapshot.forEach((doc: any) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setUserData(arr[0]);
        setLoadingUserData(false);
      }
    );
  }, [user]);
  const onSelectImage = (e: any) => {
    let image: any = [];
    let preview: any = [];
    for (let i of e.target.files) {
      image.push(i);
      const reader = new FileReader();
      reader.onload = () => {
        preview.push(reader.result);
        console.log(reader.result);
      };
    }
    setPreviewImages(preview);
    setSelecteImage(image);
    return;
    setSelecteImage(e.target.files);
    console.log(selectedImage[0]);
  };
  const onChange = (e: any) => {
    setComplainData({ ...complainData, [e.target.name]: e.target.value });
  };
  if (loading || loadingUserData) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <Loader2 className="animate-spin" />
        <span className="mt-2">Loading page</span>
      </div>
    );
  }
  if (!user || !userData) {
    router.push("/");
    return;
  }

  const onSubmit = async () => {
    const { success, message } = validateComplainFormData({
      ...complainData,
      images: selectedImage,
    });
    if (!success) {
      toast.error(message);
      return;
    }
    if(complainData.desc.length==0){
      toast.error("Please enter problem description");
      return ;
    }
    async function uploadImage(image: any) {
      const storageRef = ref(storage, `/complain/${Date.now()}-${image.name}`);
      const response = await uploadBytes(storageRef, image);
      const url = await getDownloadURL(response.ref);
      return url;
    }
    const imagePromises = Array.from(selectedImage, (image) =>
      uploadImage(image)
    );

    const uploadComplainPromise = new Promise(async (resolve, reject) => {
      try {
        const imageRes = await Promise.all(imagePromises);
        // console.log(imageRes);
        // console.log({ ...complainData, email: user?.email });
        // resolve("hello");
        // return;
        await addDoc(
          collection(
            db,
            `db/local_user/${user.email}/${userData.id}/complain_list`
          ),
          {
            ...complainData,
            phone: userData.phone,
            email: user?.email,
            images: imageRes,
            isSolved: false,
          }
        );
        await addDoc(collection(db, `db/complain/list`), {
          ...complainData,
          phone: userData.phone,
          email: user?.email,
          images: imageRes,
          isSolved: false,
        });
        resolve("Complain posted successfully");
        router.push("/user");
      } catch (error: any) {
        alert(error.message);
        reject("Please try again");
      }
    });
    toast.promise(uploadComplainPromise, {
      success: "Complain posted successfully",
      loading: "Posting complain",
      error: "Please try again",
    });
  };

  return (
    <div>
      <UserNavbar />
      <div className="mx-auto max-w-xl px-5 my-10">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    onChange={onChange}
                    id="first-name"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    onChange={onChange}
                    id="last-name"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    value={user?.email}
                    disabled
                    id="email"
                    name="email"
                    type="text"
                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="street-address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Street address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="streetAddress"
                    onChange={onChange}
                    id="street-address"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="city"
                    onChange={onChange}
                    id="city"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="region"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="state"
                    onChange={onChange}
                    id="region"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  ZIP / Postal code
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="pincode"
                    onChange={onChange}
                    id="postal-code"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
             <div className="col-span-full">
              <textarea name="desc" onChange={(e:any)=>{
                setComplainData({...complainData, [e.target.name]:e.target.value})
              }} rows={10} placeholder="Enter problem description"  className="border px-2 py-2 w-full rounded-md" />
             </div>
              <div className="col-span-full">
                <input
                  onChange={onSelectImage}
                  type="file"
                  name="myImage"
                  accept="image/*"
                  multiple
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={onSubmit}
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit Complain
          </button>
        </div>
      </div>
      <div className="grid gap-2  md:grid-cols-4 grid-cols-2">
        {previewImages?.map((image: any) => {
          return (
            <>
              <img src="" alt="" />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
