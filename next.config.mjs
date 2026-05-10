/** @type {import('next').NextConfig} */
const vercel = process.env.VERCEL === "1";
const staticExportRequested = process.env.NEXT_STATIC_EXPORT === "1";
// Vercel 默认用 Node Serverless，勿启用 output: export，否则易白屏/资源异常
const staticExport = staticExportRequested && !vercel;

const nextConfig = {
  // 纯静态托管：本地或 CI 执行 NEXT_STATIC_EXPORT=1 npm run build（不要在 Vercel 环境变量里开）
  ...(staticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
  webpack: (config, { dev }) => {
    // 开发模式下关闭持久化缓存，减少多终端/误删 .next 时的 ENOENT、chunk 404
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
