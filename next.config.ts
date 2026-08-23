import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Node 24 + OpenSSL3 breaks WasmHash md4 — use xxhash64
    const out = (config as unknown as { output?: { hashFunction?: string } }).output;
    if (out) out.hashFunction = "xxhash64";
    return config;
  },
};

export default nextConfig;
