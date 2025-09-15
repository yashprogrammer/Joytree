export async function enableMocking() {
  if (typeof window === "undefined") return;
  // Default-enable mocks in all environments unless explicitly disabled
  // Set NEXT_PUBLIC_API_MOCKING="disabled" to turn off
  if (process.env.NEXT_PUBLIC_API_MOCKING === "disabled") return;
  const { setupWorker } = await import("msw/browser");
  const { handlers } = await import("./handlers");
  const worker = setupWorker(...handlers);
  await worker.start({ serviceWorker: { url: "/mockServiceWorker.js" } });
  (window as unknown as { __mswReady?: boolean }).__mswReady = true;
}

export async function waitForMocksReady(timeoutMs = 3000): Promise<boolean> {
  if (typeof window === "undefined") return true;
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
    }, 25);
  });
}


