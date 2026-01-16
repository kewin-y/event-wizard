import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { ConvexError } from "convex/values";

export default async function Event({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const token = await convexAuthNextjsToken();

  if (!token) return null;

  try {
    const preloadedEvent = await preloadQuery(
      api.events.getBySlug,
      { slug },
      { token },
    );
    console.log(preloadedEvent);
    return <>Event: {slug}</>;
  } catch (e) {
    if (e instanceof ConvexError) {
      return <div>{e.message}</div>;
    }
  }
}
