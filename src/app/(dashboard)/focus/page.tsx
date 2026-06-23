import { getActiveSession } from "@/actions/focus.actions";
import { FocusClient } from "@/components/focus/focus-client";

export default async function FocusPage() {
  const session = await getActiveSession();

  return <FocusClient initialSession={session} />;
}
