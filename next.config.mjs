/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/puntos/:path*',
          destination: 'http://localhost:8081/puntos/:path*', // Proxy to localhost:8081
        },
      ];
    },
  };
  
  export default nextConfig;
  