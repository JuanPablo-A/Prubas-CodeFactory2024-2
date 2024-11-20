"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * This is the entry point of the application.
 * It redirects the user to the flights management page.
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/gestion-vuelos-b");
  }, [router]);
}
