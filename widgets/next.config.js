/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  assetPrefix:
    process.env.NODE_ENV === "development" ? undefined : "/chat-goal-widget",
  experimental: {
    // https://github.com/vercel/next.js/issues/9474#issuecomment-810212174
    externalDir: true,
  },
};
