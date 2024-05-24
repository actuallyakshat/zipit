import { Github } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 h-20 w-full bg-zinc-800 text-white">
      <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between">
        <h1 className="text-sm text-zinc-300">
          Created by{" "}
          <Link
            href={"https://www.linkedin.com/in/akshat-dubey29/"}
            target="_blank"
            className="font-medium"
          >
            Akshat Dubey
          </Link>
        </h1>
        <div>
          <Link
            target="_blank"
            href={"https://github.com/actuallyakshat/zipit"}
          >
            <Github />
          </Link>
        </div>
      </div>
    </footer>
  );
}
