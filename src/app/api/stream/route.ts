import { NextRequest } from "next/server";
import { openaiClient } from "@/lib/llm/client";
import { getStreamJob, deleteStreamJob } from "@/lib/streamJobs";

const ModelName = "gpt-4.1-mini";

export async function GET(req: NextRequest) {
  if (!openaiClient) {
    return new Response("LLM not configured", { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return new Response("Missing jobId parameter", {
      status: 400,
    });
  }

  const job = getStreamJob(jobId);
  if (!job) {
    return new Response("Job not found or expired", { status: 404 });
  }

  const jd = job.jd;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const send = (event: string, data: unknown) => {
          const payload = `event: ${event}\ndata: ${JSON.stringify(
            data,
          )}\n\n`;
          controller.enqueue(encoder.encode(payload));
        };

        send("start", {});

        const completion = await openaiClient!.chat.completions.create({
          model: ModelName,
          stream: true,
          messages: [
            {
              role: "system",
              content:
                "You are generating a short, streaming summary of a job description. Keep it under 60 words. Do NOT output JSON, only plain text.",
            },
            {
              role: "user",
              content: `Summarize this job description in one short paragraph:\n\n"""${jd}"""`,
            },
          ],
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            send("token", { content: delta });
          }
        }

        send("end", {});
        deleteStreamJob(jobId); 
        controller.close();
      } catch (err) {
        console.error("Error in SSE /api/extract/stream:", err);
        const message =
          err instanceof Error ? err.message : "Unknown error in stream";
        const payload = `event: error\ndata: ${JSON.stringify({
          error: message,
        })}\n\n`;
        controller.enqueue(encoder.encode(payload));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
