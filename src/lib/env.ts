// frontend/src/lib/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(40),
});

export const ENV = EnvSchema.parse(import.meta.env);
