/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'cdn.sanity.io',
        }],
        domains: ["readymadeui.com" ]
    }
};

export default nextConfig;
