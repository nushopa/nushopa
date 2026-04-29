import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react(), visualizer()],
  resolve: {
    caseSensitiveMatch: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules"))
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          if (id.includes("src/components/common")) return "common";
          if (id.includes("src/components/pages")) return "pages";
          if (id.includes("src/components/landingSection")) return "landing";
          if (id.includes("src/components/testimonial")) return "testimonial";
          return null;
        },
      },
    },
  },
});