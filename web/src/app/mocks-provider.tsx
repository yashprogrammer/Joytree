"use client";
import { useEffect } from "react";
import { enableMocking } from "@/mocks/browser";

export default function ClientMocks() {
  useEffect(() => {
    enableMocking();
  }, []);
  return null;
}


