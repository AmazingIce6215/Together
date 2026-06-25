import { getActiveSession } from "@/actions/listen.actions";
import { ListenClient } from "@/components/listen/listen-client";

export default async function ListenPage() {
  const session = await getActiveSession();

  return <ListenClient initialSession={session} />;
}
