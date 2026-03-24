import { createRequestHandler } from "react-router";
import app from "./src/server/index";

// Define Cloudflare environment types
interface Env {
  DATABASE_URL: string;
  ENVIRONMENT: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  SITE_URL: string;
}

// Augment React Router context to include Cloudflare env
declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

// Create the React Router handler
const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module provided by React Router Vite plugin
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // 1. If it's an API route, let Hono handle it
    if (url.pathname.startsWith("/api/")) {
      return app.fetch(request, env, ctx);
    }

    // 2. Otherwise, treat it as a frontend route and let React Router handle SSR
    try {
      return await requestHandler(request, {
        cloudflare: { env, ctx },
      });
    } catch (error) {
      console.error("[SSR Error]", error);
      return new Response("Internal Server Error (SSR)", { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
