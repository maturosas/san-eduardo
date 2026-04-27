"use client";

import { PresupuestoProvider } from "@/context/PresupuestoContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PresupuestoProvider>{children}</PresupuestoProvider>;
}
