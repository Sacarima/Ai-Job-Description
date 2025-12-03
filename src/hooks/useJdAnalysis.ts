"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SkillMatrix } from "@/lib/schema/skillMatrixSchema";

const STREAMING_ENABLED = process.env.NEXT_PUBLIC_LLM_STREAM_ENABLED === "true";

type AnalysisState = {
  jd: string;
  result: SkillMatrix | null;
  error: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  streamedSummary: string;
};

export function useJdAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    jd: "",
    result: null,
    error: null,
    isLoading: false,
    isStreaming: false,
    streamedSummary: "",
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const setJd = useCallback((value: string) => {
    setState((prev) => ({ ...prev, jd: value }));
  }, []);

const startStreamingSummary = useCallback(async (jd: string) => {
  if (typeof window === "undefined") return;

  if (eventSourceRef.current) {
    eventSourceRef.current.close();
    eventSourceRef.current = null;
  }

  try {
    
    const res = await fetch("/api/stream/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd }),
    });

    if (!res.ok) {
      console.warn("Failed to start streaming summary");
      return;
    }

    const data = await res.json();
    const jobId = data?.jobId as string | undefined;
    if (!jobId) {
      console.warn("No jobId returned from /api/stream/start");
      return;
    }

   
    const es = new EventSource(
      `/api/stream?jobId=${encodeURIComponent(jobId)}`,
    );
    eventSourceRef.current = es;

    setState((prev) => ({
      ...prev,
      isStreaming: true,
      streamedSummary: "",
    }));

    es.addEventListener("token", (event) => {
      const data = JSON.parse((event as MessageEvent).data) as {
        content: string;
      };
      setState((prev) => ({
        ...prev,
        streamedSummary: prev.streamedSummary + data.content,
      }));
    });

    es.addEventListener("end", () => {
      setState((prev) => ({ ...prev, isStreaming: false }));
      es.close();
      eventSourceRef.current = null;
    });

    es.addEventListener("error", () => {
      setState((prev) => ({
        ...prev,
        isStreaming: false,
      }));
      es.close();
      eventSourceRef.current = null;
    });
  } catch (err) {
    console.error("Failed to start streaming summary:", err);
  }
}, []);


  const analyze = useCallback(async () => {
    const jd = state.jd.trim();
    if (!jd) {
      setState((prev) => ({
        ...prev,
        error: "Please paste a job description before analyzing.",
        result: null,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      error: null,
      isLoading: true,
      result: null,
    }));

    if (STREAMING_ENABLED) {
      startStreamingSummary(jd);
    }

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error ?? "Failed to analyze job description.";
        setState((prev) => ({
          ...prev,
          error: msg,
          result: null,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        result: data as SkillMatrix,
      }));
    } catch (err) {
      console.error("Analyze error:", err);
      setState((prev) => ({
        ...prev,
        error: "Network error while analyzing job description.",
        result: null,
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [startStreamingSummary, state.jd]);

  return {
    ...state,
    setJd,
    analyze,
  };
}
