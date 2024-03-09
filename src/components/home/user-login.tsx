import React, { useEffect, useState } from "react";
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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/firebase/config";
import toast from "react-hot-toast";
import { addDoc, collection, getDoc, getDocs } from "firebase/firestore";
import validateSignUpFormData from "@/lib/validate-signup-form";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
export default function UserLogin({ userData }: any) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  // const [userData, setUserData] = useState();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = React.useState<any>("login");
  const [userSignUpData, setUserSignUpData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [userLoginData, setUserLoginData] = useState<any>({
    email: "",
    password: "",
  });

  const onLogin = () => {
    if (userData) {
      router.push("/user");
      return;
    }
    const { email, password } = userLoginData;
    let signInPromise = new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((credential) => {
          resolve("Login successfully");
          router.push("/user");
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
  const onSignUp = () => {
    const { success, message } = validateSignUpFormData(userSignUpData);
    if (!success) {
      toast.error(message);
      return;
    }
    const { name, email, phone, password } = userSignUpData;
    let userSignUpPromise = new Promise(async (resolve, reject) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((credential) => {
          addDoc(collection(db, `db/local_user/${email}`), {
            email: email,
            phone: phone,
            name: name,
          }).then((res) => {
            resolve("Account created, Please login!!");
          });
        })
        .catch((error: any) => {
          reject("Already have an account!!");
        });
    });
    toast.promise(userSignUpPromise, {
      loading: "Account creating!!!",
      success: "Acccount created, Please Login!!",
      error: "Already have an account!!",
    });
    console.log(userSignUpData);
  };
  return (
    <>
      <Button
        color="warning"
        className="text-black"
        onPress={() => {
          if (userData) {
            router.push("/user");
            return;
          }
          onOpen();
        }}
      >
        USER LOGIN/REGISTRATION
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selected === "login" ? "Login account" : "Create an account"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col w-full">
                  <Card
                    className={`max-w-full border ${
                      selected === "login" ? "" : "h-[450px]"
                    }  `}
                  >
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
                                setUserLoginData({
                                  ...userLoginData,
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
                                setUserLoginData({
                                  ...userLoginData,
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
                                onClick={onLogin}
                                fullWidth
                                color="primary"
                              >
                                Login
                              </Button>
                            </div>
                          </form>
                        </Tab>
                        <Tab key="sign-up" title="Sign up">
                          <form className="flex flex-col gap-4 h-[300px]">
                            <Input
                              isRequired
                              name="name"
                              onChange={(e: any) => {
                                setUserSignUpData({
                                  ...userSignUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              label="Name"
                              placeholder="Enter your name"
                              type="text"
                            />
                            <Input
                              isRequired
                              name="email"
                              onChange={(e: any) => {
                                setUserSignUpData({
                                  ...userSignUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                            />
                            <Input
                              name="password"
                              onChange={(e: any) => {
                                setUserSignUpData({
                                  ...userSignUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              isRequired
                              label="Password"
                              placeholder="Enter your password"
                              type="password"
                            />
                            <Input
                              name="phone"
                              onChange={(e: any) => {
                                setUserSignUpData({
                                  ...userSignUpData,
                                  [e.target.name]: e.target.value,
                                });
                              }}
                              isRequired
                              label="Phone nno."
                              placeholder="Enter your phone"
                              type="number"
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
                                onClick={onSignUp}
                                fullWidth
                                color="primary"
                              >
                                Sign up
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
