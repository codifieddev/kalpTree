import React from "react";
import BillingShell from "./BillingShell";


export default function page({ children }: { children: React.ReactNode }) {
  return <BillingShell>{children}</BillingShell>;
}
