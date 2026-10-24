import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/bienes-raices-app/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});