import { NextRequest, NextResponse } from "next/server";
import {
  ExtractRequestSchema,
  SkillMatrixSchema,
  type SkillMatrix,
} from "@/lib/schema/skillMatrixSchema";
import { getExtractor } from "@/lib/extractors";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);

    const parsed = ExtractRequestSchema.safeParse(json);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid request payload.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { jd } = parsed.data;

    const extractor = getExtractor();
    const rawResult: SkillMatrix = await extractor.extract(jd);

    const validated = SkillMatrixSchema.parse(rawResult);

    return NextResponse.json(validated, { status: 200 });
  } catch (err) {
    console.error("Error in /api/extract:", err);
    return NextResponse.json(
      { error: "Unexpected server error while analyzing job description." },
      { status: 500 },
    );
  }
}
