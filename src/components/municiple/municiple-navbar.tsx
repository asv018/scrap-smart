import React from "react";
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
import { auth } from "@/firebase/config";
import Link from "next/link";
// AcmeLogo
export default function MunicipalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const routes: any = [];

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
        {routes?.map((route: any, index: any) => {
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
            color="danger"
            variant="solid"
          >
            Log Out
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {routes.map((route: any, index: any) => (
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
