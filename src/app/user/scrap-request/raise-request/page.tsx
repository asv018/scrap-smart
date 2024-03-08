"use client";
import UserNavbar from "@/components/user/navbar";
import { auth, db, storage } from "@/firebase/config";
import { wasteList as wasteListDetails } from "@/lib/waste-product-list";
import { Button } from "@nextui-org/react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChevronRightCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

function Page() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<any>();
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [selectedWaste, setSelectedWaste] = useState();
  const [selectedProduct, setSelectedProduct] = useState<any>([]);
  const [wasteList, setWasteList] = useState(wasteListDetails);
  const [selectedImage, setSelectedImage] = useState();
  const [address, setAddress] = useState("");
  const [pickUpDate, setPickUpDate] = useState(null);
  const addItems = (item: any) => {
    setSelectedProduct([...selectedProduct, item]);
    console.log(selectedProduct);
  };
  const removeSelectedItem = (item: any) => {
    let filterProducts = selectedProduct.filter((product: any) => {
      return product.id != item.id;
    });
    setSelectedProduct(filterProducts);
    console.log(filterProducts);
  };

  const onChange = (e: any) => {
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
    setSelectedImage(image);
  };
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

  const onSubmit = () => {
    if (!selectedWaste) {
      toast.error("Please select a waste");
      return;
    } else if (selectedProduct.length == 0) {
      toast.error("Select at least a waste material");
      return;
    } else if (!selectedImage) {
      toast.error("Please upload images");
      return;
    } else if (address.length == 0) {
      toast.error("Please enter address");
      return;
    } else if (!pickUpDate) {
      toast.error("Please choose pickup date");
      return;
    }
    async function uploadImage(image: any) {
      const storageRef = ref(storage, `/request/${Date.now()}-${image.name}`);
      const response = await uploadBytes(storageRef, image);
      const url = await getDownloadURL(response.ref);
      return url;
    }
    const imagePromises = Array.from(selectedImage, (image) =>
      uploadImage(image)
    );
    const promise = new Promise(async (resolve, reject) => {
      try {
        const imageRes = await Promise.all(imagePromises);
        await addDoc(
          collection(
            db,
            `db/local_user/${user?.email}/${userData?.id}/request_list`
          ),
          {
            wasteName: selectedWaste,
            product: selectedProduct,
            ...userData,
            images: imageRes,
            address,
            pickUpDate,
          }
        );
        await addDoc(collection(db, `db/request/list`), {
          wasteName: selectedWaste,
          product: selectedProduct,
          ...userData,
          images: imageRes,
          verified: false,
          address,
          pickUpDate,
        });
        resolve("Reqeust done");
        router.push("/user");
      } catch (error) {
        reject("Please try again");
      }
    });
    toast.promise(promise, {
      success: "Request send successfully",
      loading: "Request sending",
      error: "Please try again",
    });
  };
  if (loading || loadingUserData) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <Loader2 className="animate-spin" />
        <span className="mt-2">Loading page</span>
      </div>
    );
  }
  if (!user || loadingUserData) {
    toast.error("Please login as user");
    // route;
    router.push("/");
  }
  return (
    <>
      <UserNavbar />
      <div className="px-3 max-w-4xl mx-auto">
        <h1 className="my-6 text-3xl font-bold">
          Selected Product Category - {selectedWaste}
        </h1>
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {wasteList?.map((waste: any) => {
            return (
              <>
                <div
                  onClick={() => {
                    setSelectedWaste(waste.wasteName);
                    setSelectedProduct([]);
                  }}
                  className={`${
                    selectedWaste === waste.wasteName ? "bg-gray-100" : ""
                  } px-2 hover:cursor-pointer hover:bg-gray-100 duration-200 py-2 flex  border border-dashed`}
                >
                  <div className=" px-2">
                    <img
                      className="rounded-full object-cover w-20 h-20"
                      src={waste.img}
                      alt=""
                    />
                  </div>
                  <div className="w-8/12">
                    <h1 className="text-xl font-bold">{waste.wasteName}</h1>
                    <span>{waste.shortDesc}</span>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        {selectedWaste && (
          <h1 className="text-xl my-6 font-bold">
            Choose Product to sell from - {selectedWaste}{" "}
          </h1>
        )}
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {wasteList
            ?.filter((e: any) => {
              return e.wasteName === selectedWaste;
            })?.[0]
            ?.product?.map((product: any) => {
              let isSelected = selectedProduct?.filter((item: any) => {
                return item.id === product.id;
              })[0];
              if (isSelected) {
                return (
                  <div
                    onClick={() => {
                      removeSelectedItem(product);
                    }}
                    className="flex px-2 bg-gray-100 py-2 border"
                  >
                    <div className=" px-2 py-2 ">
                      <ChevronRightCircle className="rotate-90  h-8 w-8" />
                    </div>
                    <div className="w-10/12">
                      <h1 className="font-bold">{product.name}</h1>
                      <span>₹ {product.price}</span>
                    </div>
                  </div>
                );
              }

              return (
                <>
                  <div
                    onClick={() => {
                      addItems(product);
                    }}
                    className="flex hover:cursor-pointer hover:bg-gray-100 px-2 py-2 border"
                  >
                    <div className=" px-2 py-2 ">
                      <ChevronRightCircle className="rotate-90  h-8 w-8" />
                    </div>
                    <div className="w-10/12">
                      <h1 className="font-bold">{product.name}</h1>
                      <span>₹ {product.price}</span>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
        <div className="my-6">
          {selectedProduct.length ? (
            <>
              <div className="flex lg:flex-row flex-col gap-6 mb-5 justify-between">
                <input
                  accept="image/*"
                  multiple
                  onChange={onChange}
                  type="file"
                  className="border px-2 py-2"
                />
                <input
                  onChange={(e: any) => {
                    setPickUpDate(e.target.value);
                  }}
                  type="date"
                  className="border px-2 py-2"
                />
                <input
                  onChange={(e: any) => {
                    setAddress(e.target.value);
                  }}
                  type="text"
                  placeholder="Enter address"
                  className="px-2 py-2 rounded-lg border"
                />
              </div>
              <Button onClick={onSubmit}>Submit</Button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default Page;
