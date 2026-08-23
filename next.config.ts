import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Node 24 + OpenSSL3 breaks WasmHash md4 — use xxhash64
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((config as unknown as { output?: { hashFunction?: string } }).output) {
      (config as unknown as { output: { hashFunction: string } }).output.hashFunction = "xxhash64";
    }
    return config;
  },
};

export default nextConfig;
