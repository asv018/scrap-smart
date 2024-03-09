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
import {
  Tabs,
  Tab,
  Input,
  Link,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function MunicipalityLogin({ userData }: any) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = React.useState<any>("login");
  const [municipalData, setMunicipalData] = useState({
    email: "",
    password: "",
  });
  const onSubmit = () => {
    signInWithEmailAndPassword(
      auth,
      municipalData.email,
      municipalData.password
    )
      .then((res) => {
        toast.success("Successfully login");
        router.push("/municipal");
      })
      .catch((err) => {
        toast.error("Invalid email or password");
      });
  };
  return (
    <>
      <Button
        color="warning"
        className="text-black"
        onPress={() => {
          console.log(userData);
          if (userData?.email?.includes("member@gmail.com")) {
            router.push("/municipal");
            return;
          } else {
            toast.error("Please login with municipality id");
            onOpen();
          }
        }}
      >
        MUNICIPALITY LOGIN/REGISTRATION
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col w-full">
                  <Card className="max-w-full">
                    <CardBody className="overflow-hidden">
                      <Tabs
                        fullWidth
                        size="md"
                        aria-label="Tabs form"
                        selectedKey={selected}
                        onSelectionChange={setSelected}
                      >
                        <Tab key="login" title="Login">
                          <form className="flex flex-col gap-4">
                            <Input
                              isRequired
                              name="email"
                              onChange={(e: any) => {
                                setMunicipalData({
                                  ...municipalData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                            />
                            <Input
                              isRequired
                              name="password"
                              onChange={(e: any) => {
                                setMunicipalData({
                                  ...municipalData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              label="Password"
                              placeholder="Enter your password"
                              type="password"
                            />
                            <p className="text-center text-small">
                              Need to create an account?{" "}
                              <Link
                                size="sm"
                                onPress={() => setSelected("sign-up")}
                              >
                                Sign up
                              </Link>
                            </p>
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={onSubmit}
                                fullWidth
                                color="primary"
                              >
                                Login
                              </Button>
                            </div>
                          </form>
                        </Tab>
                      </Tabs>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
