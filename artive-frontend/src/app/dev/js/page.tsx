import { redirect } from "next/navigation";

export default function DevJsLegacyRedirect() {
  redirect("/dev?tab=js");
}
