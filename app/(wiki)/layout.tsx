import { cacheLife } from "next/cache";
import type { ReactNode } from "react";
import { WikiFrame } from "@/components/wiki/wiki-frame";

export default async function WikiLayout({ children }: { children: ReactNode }) {
  "use cache";
  cacheLife("max");

  return <WikiFrame>{children}</WikiFrame>;
}
