"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export function PortalHydrate({ children }: { children: React.ReactNode }) {
  const refreshMe = useAuthStore((state) => state.refreshMe);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  return children;
}
