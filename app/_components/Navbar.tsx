import React from "react";
import NavbarModalTriggers from "./NavbarModalTriggers";

export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-[40] h-16 w-full">
      <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between">
        <h1 className="text-xl font-extrabold">Zipit</h1>
        <NavbarModalTriggers />
      </div>
    </nav>
  );
}
