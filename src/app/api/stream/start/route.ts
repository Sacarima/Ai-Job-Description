import { NextResponse } from "next/server";
import { createStreamJob } from "@/lib/streamJobs";
import { ExtractRequestSchema } from "@/lib/schema/skillMatrixSchema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ExtractRequestSchema.parse(body);

    const jobId = createStreamJob(parsed.jd);

    return NextResponse.json({ jobId });
  } catch (err) {
    console.error("Error starting stream job:", err);
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }
}
