export async function enableMocking() {
  if (typeof window === "undefined") return;
  if (
    process.env.NEXT_PUBLIC_API_MOCKING !== "enabled" &&
    process.env.NODE_ENV !== "development"
  ) {
    return;
  }
  const { setupWorker } = await import("msw/browser");
  const { handlers } = await import("./handlers");
  const worker = setupWorker(...handlers);
  await worker.start({ serviceWorker: { url: "/mockServiceWorker.js" } });
}


