import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Communication Reboot Kit is removed for everyone (Juliette, 29 Oct 2026). Old links go to the home shelf.
  async redirects() {
    return [
      { source: "/practice/communication-reboot-kit", destination: "/", permanent: false },
      { source: "/practice/communication-reboot-kit/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
