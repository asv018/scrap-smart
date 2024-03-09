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
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import toast from "react-hot-toast";

export default function ScrapCollectorLogin({ userData }: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = React.useState<any>("login");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const onLogin = () => {
    if (userData) {
      router.push("/scrap-collector");
      return;
    }
    const { email, password } = loginData;
    let signInPromise = new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((credential) => {
          resolve("Login successfully");
          router.push("/scrap-collector");
        })
        .catch((error: any) => {
          reject("Email and password invalid");
        });
    });
    toast.promise(signInPromise, {
      loading: "Logging...",
      error: "Email and password invalid",
      success: "Login successfully",
    });
  };
  return (
    <>
      <Button
       color="warning"
       className="text-black"
        onPress={() => {
          if (userData) {
            router.push("/scrap-collector");
            return;
          }
          onOpen();
        }}
      >
        SCRAP COLLECTOR LOGIN/REGISTRATION
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selected === "login" ? "Login account" : "Create new account"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col w-full">
                  <Card className="max-w-full ">
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
                              name="email"
                              onChange={(e: any) => {
                                setLoginData({
                                  ...loginData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              isRequired
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                            />
                            <Input
                              isRequired
                              label="Password"
                              name="password"
                              onChange={(e: any) => {
                                setLoginData({
                                  ...loginData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
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
                                onClick={onLogin}
                                fullWidth
                                color="primary"
                              >
                                Login
                              </Button>
                            </div>
                          </form>
                        </Tab>
                        {/* <Tab key="sign-up" title="Sign up">
                          <form className="flex flex-col gap-4 ">
                            <Input
                              isRequired
                              label="Name"
                              name="name"
                              onChange={(e: any) => {
                                setSignUpData({
                                  ...signUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              placeholder="Enter your name"
                              type="text"
                            />
                            <Input
                              isRequired
                              label="Email"
                              name="email"
                              onChange={(e: any) => {
                                setSignUpData({
                                  ...signUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              placeholder="Enter your email"
                              type="email"
                            />
                            <Input
                              isRequired
                              label="Password"
                              name="password"
                              onChange={(e: any) => {
                                setSignUpData({
                                  ...signUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              placeholder="Enter your password"
                              type="password"
                            />
                            <Input
                              isRequired
                              label="Password"
                              name="aadharCard"
                              onChange={(e: any) => {
                                setSignUpData({
                                  ...signUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              placeholder="Enter your aadhar no"
                              type="text"
                            />
                            <Input
                              isRequired
                              label="Password"
                              name="phone"
                              onChange={(e: any) => {
                                setSignUpData({
                                  ...signUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              placeholder="Enter your phone no"
                              type="text"
                            />
                            <p className="text-center text-small">
                              Already have an account?{" "}
                              <Link
                                size="sm"
                                onPress={() => setSelected("login")}
                              >
                                Login
                              </Link>
                            </p>
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={onSubmit}
                                fullWidth
                                color="primary"
                              >
                                Sign up
                              </Button>
                            </div>
                          </form>
                        </Tab> */}
                      </Tabs>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
