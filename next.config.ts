import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'ticket.yaepublishing.house' }],
        destination: 'https://yaepublishing.house/ticket',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
