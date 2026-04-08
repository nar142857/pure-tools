import path from "path";
import type { NextConfig } from "next";

const emptyModule = path.resolve(__dirname, "src/empty.ts");

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    resolveAlias: {
      canvas: emptyModule,
      encoding: emptyModule,
    },
  },
};

export default nextConfig;
