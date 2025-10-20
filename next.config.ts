import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output для Docker
  output: "standalone",

  // Оптимизация для production
  reactStrictMode: true,

  // Разрешаем внешние изображения (добавьте ваши домены)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
