import { createClient } from "@supabase/supabase-js";

// Tworzymy klienta z uprawnieniami service_role
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY || "";

// Sprawdzamy czy klucz service_role jest dostępny
const serviceRoleClient = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export { serviceRoleClient };
