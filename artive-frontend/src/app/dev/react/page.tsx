import { redirect } from "next/navigation";

export default function DevReactLegacyRedirect() {
  redirect("/dev?tab=react");
}
