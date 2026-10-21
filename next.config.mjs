const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Mengabaikan ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // Mengabaikan error TypeScript saat build Hostinger
  },
};
export default nextConfig;