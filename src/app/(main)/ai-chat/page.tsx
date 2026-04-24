import AIChatClient from "@/components/ai/AIChatClient";
import { requireAuth } from "@/lib/auth.util";

export default async function AIChatPage() {
  await requireAuth();

  return <AIChatClient />;
}
