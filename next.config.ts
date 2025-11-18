 import type { NextConfig } from "next";

const nextConfig: NextConfig = {
//reactStrictMode:true,
  images: {
    remotePatterns: [
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
        pathname:"/**",
        
      },
      {
        protocol: 'http', 
        hostname: 'localhost', 
        port: '8000', 
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
