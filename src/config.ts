// src/config.ts
import * as dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  apiKey: process.env.PROPRIETARY_API_KEY,
  baseUrl: process.env.PROPRIETARY_API_BASE_URL ?? 'https://api.zappic.co',
};
