import { redirect } from "next/navigation";
import { getNextRace, getLocationSlug } from "@/lib/race-utils";

export const dynamic = "force-dynamic";

export default function BriefIndex() {
  const race = getNextRace();
  if (race) {
    redirect(`/brief/${getLocationSlug(race)}`);
  }
  redirect("/chat");
}
