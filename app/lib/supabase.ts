// lib/supabase.ts

import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// Credenciais REAIS do seu projeto Supabase
const supabaseUrl = "https://copeafawtwgxojfdaqjo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvcGVhZmF3dHdneG9qZmRhcWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzMxMTIsImV4cCI6MjA3OTgwOTExMn0.cYC9gt4vpgt-h9-ce7NaTGN3A-P8uVBzQ7CYV02JIhU";

// Cliente único (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
