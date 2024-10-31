import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    // (Optional) Export as a static site
  // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
  //output: 'export', // Feel free to modify/remove this option

  // Override the default webpack configuration
  // webpack: (config) => {
  //     // See https://webpack.js.org/configuration/resolve/#resolvealias
  //     config.resolve.alias = {
  //         ...config.resolve.alias,
  //         "sharp$": false,
  //         "onnxruntime-node$": false,
  //     }
  //     return config;
  // },
};

export default nextConfig;
