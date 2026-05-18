import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  allowedDevOrigins: ['spitefully-diurnally-splendid-fieldfare.kitten.space'],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
