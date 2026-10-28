// Anonymous, fire-and-forget counting. See app/api/count/route.ts.
export function count(e: string, day?: number, feel?: string) {
  try {
    fetch("/api/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ e, day, feel }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
