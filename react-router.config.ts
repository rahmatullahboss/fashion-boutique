import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Fallback to SPA mode during transition, SSR will be enabled when components are ready
  ssr: true,
  appDirectory: "app",
} satisfies Config;
