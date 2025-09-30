"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide header on gifts page route: /c/[slug]/gifts and its children
  const shouldHideHeader = /^\/c\/[^/]+\/gifts(\/.*)?$/.test(pathname || "");

  if (shouldHideHeader) return null;

  const handleLogoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Extract slug from pathname for campaign pages
    const slugMatch = pathname?.match(/^\/c\/([^/]+)/);
    const slug = slugMatch ? slugMatch[1] : null;

    // 1. On details page -> Do nothing
    if (pathname?.match(/^\/c\/[^/]+\/details$/)) {
      return;
    }

    // 2. On address page -> Redirect to gifts page
    if (pathname?.match(/^\/c\/[^/]+\/address$/)) {
      if (slug) {
        router.push(`/c/${slug}/gifts`);
      }
      return;
    }

    // 3. On confirm page -> Redirect to gifts page
    if (pathname?.match(/^\/c\/[^/]+\/confirm$/)) {
      if (slug) {
        router.push(`/c/${slug}/gifts`);
      }
      return;
    }

    // 4. On thank you page (order summary) -> Redirect to auth page
    if (pathname?.match(/^\/order\/[^/]+\/summary$/)) {
      // Extract slug from localStorage if available
      const orderId = pathname.match(/^\/order\/([^/]+)\/summary$/)?.[1];
      let campaignSlug = slug; // Try to get from URL first
      
      // If not in URL, try to get from localStorage
      if (!campaignSlug && orderId && typeof window !== "undefined") {
        try {
          const orderData = window.localStorage.getItem(`joytree_order_${orderId}`);
          if (orderData) {
            const parsed = JSON.parse(orderData);
            campaignSlug = parsed.campaignSlug;
          }
        } catch {}
      }
      
      if (campaignSlug) {
        router.push(`/c/${campaignSlug}/auth`);
      }
      return;
    }

    // Default behavior: go to home
    router.push("/");
  };

  return (
    <div className="px-2 pt-2">
      <button onClick={handleLogoClick} aria-label="Joytree Home" className="cursor-pointer">
        <Image src="/JoytreeLogo.png" alt="Joytree" width={96} height={24} priority />
      </button>
    </div>
  );
}


