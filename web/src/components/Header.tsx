"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Hide header on gifts page route: /c/[slug]/gifts and its children
  const shouldHideHeader = /^\/c\/[^/]+\/gifts(\/.*)?$/.test(pathname || "");

  if (shouldHideHeader) return null;

  return (
    <div className="px-2 pt-2">
      <Link href="/" aria-label="Joytree Home">
        <Image src="/JoytreeLogo.png" alt="Joytree" width={96} height={24} priority />
      </Link>
    </div>
  );
}


