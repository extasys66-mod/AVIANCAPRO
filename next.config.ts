import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: "es.investinbogota.org" },
      { hostname: "i0.wp.com" },
      { hostname: "passporterapp.com" },
      { hostname: "probarranquilla.org" },
      { hostname: "elpilon.com.co" },
      { hostname: "static.avianca.com" }
    ],
  },
  output: "standalone",
  eslint: {
    // Advertencia: Esto permite que las compilaciones de producción finalicen con éxito 
    // incluso si su proyecto tiene errores de ESLint.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Advertencia: Esto permite que las compilaciones de producción finalicen con éxito 
    // incluso si su proyecto tiene errores de tipo.
    ignoreBuildErrors: true,
  },
  devIndicators: false,
};

export default nextConfig;
