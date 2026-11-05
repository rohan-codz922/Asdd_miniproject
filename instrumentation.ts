// Next.js instrumentation hook – runs once when the server starts.
// Sentry is initialized here only if NEXT_PUBLIC_SENTRY_DSN is provided,
// so the app works identically without it.
//
// To enable:
//   1. npm install @sentry/nextjs
//   2. Set NEXT_PUBLIC_SENTRY_DSN in your environment / GitHub secret
//   3. Uncomment the imports below and deploy

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return; // Sentry disabled – no DSN configured

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import to avoid bundling Sentry when DSN is absent
    // const { init } = await import('@sentry/nextjs');
    // init({ dsn, tracesSampleRate: 0.1 });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // const { init } = await import('@sentry/nextjs/edge');
    // init({ dsn, tracesSampleRate: 0.1 });
  }
}
