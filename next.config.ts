import type { NextConfig } from "next";
import 'dotenv/config';


const nextConfig: NextConfig = {
  /* config options here */
  env: {
    OPENAI_BASE_URL : process.env.OPENAI_BASE_URL || "https://llamatool.us.gaianet.network/v1",
    OPENAI_MODEL_NAME : process.env.OPENAI_MODEL_NAME || "llama",
    /* for gaia node, anything goes */
    /* CAREFULL: This Key will be public through the browser */    
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "NA",   
    /* pro-api has actual information, sandbox-api has test information */
    COINMARKET_URL: process.env.COINMARKET_URL || "https://sandbox-api.coinmarketcap.com/",
    COINMARKET_API: process.env.COINMARKET_API || "",
  }
};

export default nextConfig;
