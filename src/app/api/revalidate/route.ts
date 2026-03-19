import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Vérifier le secret Vercel
  const secret = request.headers.get("x-vercel-webhook-secret");
  
  if (secret !== process.env.VERCEL_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, entity_id } = body;

    // Revalider les pages basées sur le type
    switch (type) {
      case "news":
        revalidateTag("news");
        revalidateTag(`news-${entity_id}`);
        break;
      case "film":
        revalidateTag("films");
        revalidateTag(`film-${entity_id}`);
        break;
      case "event":
        revalidateTag("events");
        revalidateTag(`event-${entity_id}`);
        break;
      case "job":
        revalidateTag("jobs");
        revalidateTag(`job-${entity_id}`);
        break;
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid webhook" },
      { status: 400 }
    );
  }
}
