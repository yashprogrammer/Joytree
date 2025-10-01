export async function enableMocking() {
  if (typeof window === "undefined") return;
  // Default DISABLED. Enable only when explicitly opted-in.
  // Set NEXT_PUBLIC_API_MOCKING="enabled" to turn on
  if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return;
  const { setupWorker } = await import("msw/browser");
  const { handlers } = await import("./handlers");
  const worker = setupWorker(...handlers);
  await worker.start({ serviceWorker: { url: "/mockServiceWorker.js" } });
  (window as unknown as { __mswReady?: boolean }).__mswReady = true;
}

export async function waitForMocksReady(timeoutMs = 3000): Promise<boolean> {
  if (typeof window === "undefined") return true;
  // If mocking is not enabled, return immediately without waiting
  if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return true;
  
  const win = window as unknown as { __mswReady?: boolean };
  if (win.__mswReady) return true;
  const start = Date.now();
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (win.__mswReady) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, 2);
  });
}


