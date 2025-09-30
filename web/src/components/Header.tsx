"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide header on gifts page route: /c/[slug]/gifts and its children
  const shouldHideHeader = /^\/c\/[^/]+\/gifts(\/.*)?$/.test(pathname || "");

  if (shouldHideHeader) return null;

  // Check if we're on details page: /c/[slug]/details
  const isDetailsPage = /^\/c\/[^/]+\/details$/.test(pathname || "");

  // Check if we're on address page: /c/[slug]/address
  const isAddressPage = /^\/c\/[^/]+\/address$/.test(pathname || "");

  // Handle logo click
  const handleLogoClick = (e: React.MouseEvent) => {
    if (isDetailsPage) {
      // Do nothing on details page
      e.preventDefault();
      return;
    }

    if (isAddressPage) {
      // Redirect to gifts page
      e.preventDefault();
      const slugMatch = pathname?.match(/^\/c\/([^/]+)\//);
      if (slugMatch && slugMatch[1]) {
        router.push(`/c/${slugMatch[1]}/gifts`);
      }
      return;
    }

    // Default behavior for other pages (handled by Link)
  };

  // For details page, render as non-clickable
  if (isDetailsPage) {
    return (
      <div className="px-2 pt-2">
        <div className="cursor-default">
          <Image src="/JoytreeLogo.png" alt="Joytree" width={96} height={24} priority />
        </div>
      </div>
    );
  }

  // For address page or other pages with custom navigation
  if (isAddressPage) {
    return (
      <div className="px-2 pt-2">
        <button onClick={handleLogoClick} className="cursor-pointer" aria-label="Back to Gifts">
          <Image src="/JoytreeLogo.png" alt="Joytree" width={96} height={24} priority />
        </button>
      </div>
    );
  }

  // Default behavior for other pages
  return (
    <div className="px-2 pt-2">
      <Link href="/" aria-label="Joytree Home">
        <Image src="/JoytreeLogo.png" alt="Joytree" width={96} height={24} priority />
      </Link>
    </div>
  );
}


