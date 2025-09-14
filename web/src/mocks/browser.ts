export async function enableMocking() {
  if (typeof window === "undefined") return;
  // Default-enable mocks in all environments unless explicitly disabled
  // Set NEXT_PUBLIC_API_MOCKING="disabled" to turn off
  if (process.env.NEXT_PUBLIC_API_MOCKING === "disabled") return;
  const { setupWorker } = await import("msw/browser");
  const { handlers } = await import("./handlers");
  const worker = setupWorker(...handlers);
  await worker.start({ serviceWorker: { url: "/mockServiceWorker.js" } });
}


