import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Star, StarIcon } from "lucide-react";
import toast from "react-hot-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function RateCartModal({ userData }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rateData, setRateData] = useState({
    desc: "",
    star: -1,
  });

  const onSubmit = (onClose: any) => {
    if (rateData.star == -1) {
      toast.error("Please select rating");
      return;
    } else if (rateData.desc.length <= 0) {
      toast.error("Please enter your message");
      return;
    }
    let addReview = new Promise((resolve, reject) => {
      addDoc(collection(db, "db/review/list"), {
        ...rateData,
        ...userData,
        timestamp: serverTimestamp(),
      })
        .then((res: any) => {
          resolve("Review added");
          onClose();
        })
        .catch((error: any) => {
          reject("Please try again");
        });
    });
    toast.promise(addReview, {
      loading: "Adding review",
      error: "Please try again",
      success: "Review added successfully",
    });
  };
  return (
    <>
      <Button startContent={<Star />} onPress={onOpen}>
        Rate Card
      </Button>
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Rate Card
              </ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  value={userData.name}
                  disabled
                  className="px-2 py-2 border rounded-md"
                />
                <input
                  type="text"
                  value={userData.email}
                  disabled
                  className="px-2 py-2 border rounded-md"
                />

                <div className="flex gap-2">
                  {Array(5)
                    .fill(0)
                    .map((e: any, index: number) => {
                      if (index + 1 <= rateData.star) {
                        return (
                          <>
                            <StarIcon
                              className="text-yellow-600 hover:cursor-pointer"
                              onClick={(e) => {
                                setRateData({ ...rateData, star: index + 1 });
                              }}
                            />
                          </>
                        );
                      }
                      return (
                        <>
                          <StarIcon
                            className="hover:cursor-pointer"
                            onClick={(e) => {
                              setRateData({ ...rateData, star: index + 1 });
                            }}
                          />
                        </>
                      );
                    })}
                </div>
                <textarea
                  onChange={(e: any) => {
                    setRateData({
                      ...rateData,
                      [e.target.name]: e.target.value,
                    });
                  }}
                  name="desc"
                  placeholder="Enter your message"
                  className="px-2 py-2 border rounded-md"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onSubmit(onClose);
                  }}
                  color="primary"
                  onPress={onClose}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
