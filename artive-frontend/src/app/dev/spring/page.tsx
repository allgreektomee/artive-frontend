import { redirect } from "next/navigation";

export default function DevSpringLegacyRedirect() {
  redirect("/dev?tab=spring");
}
