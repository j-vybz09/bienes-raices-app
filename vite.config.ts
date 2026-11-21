import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // GitHub Pages utiliza una subruta.
  // DOM Cloud utiliza la raíz del dominio.
  base:
    process.env.GITHUB_ACTIONS === "true"
      ? "/bienes-raices-app/"
      : "/",

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
