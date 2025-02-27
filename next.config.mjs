/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/Odin-Shopping-Cart' : '',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
