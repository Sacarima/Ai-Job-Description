export type StreamJob = {
  jd: string;
  createdAt: number;
};

const jobs = new Map<string, StreamJob>();

export function createStreamJob(jd: string): string {
  const id = crypto.randomUUID();
  jobs.set(id, { jd, createdAt: Date.now() });
  return id;
}

export function getStreamJob(id: string | null): StreamJob | null {
  if (!id) return null;
  return jobs.get(id) ?? null;
}

export function deleteStreamJob(id: string) {
  jobs.delete(id);
}
