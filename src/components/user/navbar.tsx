import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";
import { DollarSign } from "lucide-react";
// AcmeLogo
export default function UserNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const routes = [
    {
      route: "/user/profile",
      name: "Profile",
    },
  ];
  const [user, loading, error] = useAuthState(auth);
  //   if(user)
  const [coin, setCoin] = useState(0);
  const [userData, setUserData] = useState<any>();
  useEffect(() => {
    getDocs(collection(db, `db/local_user/${user?.email}`)).then(
      (querySnapshot: any) => {
        let arr: any = [];
        querySnapshot.forEach((doc: any) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setUserData(arr[0]);
      }
    );
  }, [user]);
  useEffect(() => {
    getDocs(
      collection(db, `db/local_user/${user?.email}/${userData?.id}/coin`)
    ).then((res) => {
      let totalCoin = 0;
      res.forEach((coin: any) => {
        console.log(coin.data());
        totalCoin += coin.data().coin;
      });

      setCoin(totalCoin);
    });
  }, [userData]);
  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        {routes.map((route, index) => {
          return (
            <>
              <NavbarItem>
                <Link color="foreground" href={route.route}>
                  {route.name}
                </Link>
              </NavbarItem>
            </>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            onClick={() => {
              signOut(auth);
            }}
            color="success"
            variant="flat"
          >
            +{coin} <DollarSign className="h-4 w-4" />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            onClick={() => {
              signOut(auth);
            }}
            color="danger"
            variant="solid"
          >
            Log Out
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {routes.map((route, index) => (
          <NavbarMenuItem key={`${route.name}-${index}`}>
            <Link className="w-full" color="foreground" href={route.route}>
              {route.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
