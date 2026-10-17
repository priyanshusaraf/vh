import { track } from "@vercel/analytics";

// Conversion events for Vercel Web Analytics. Custom events are only recorded
// on paid Vercel plans; elsewhere this is a no-op.
export function trackEvent(name, properties) {
  try {
    track(name, properties);
  } catch {}
}
