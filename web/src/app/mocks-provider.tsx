"use client";
import { useLayoutEffect } from "react";
import { enableMocking } from "@/mocks/browser";

export default function ClientMocks() {
  useLayoutEffect(() => {
    enableMocking();
  }, []);
  return null;
}


