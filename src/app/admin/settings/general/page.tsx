import { RootSettings } from "@/components/admin/settings/rootsetting";
import { cookies } from "next/headers";

export default async function () {
  return (
    <>
      <RootSettings />
    </>
  );
}
