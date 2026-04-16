import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    
    const { data: users } = await supabase.auth.admin.listUsers();
    const admin = users?.users?.find(u => u.email === "b2csolution2436@gmail.com");
    
    if (!admin) throw new Error("Admin not found");
    
    const { error } = await supabase.auth.admin.updateUserById(admin.id, { 
      password: "omharde300@shree6",
      email_confirm: true 
    });
    
    if (error) throw error;
    
    return new Response(JSON.stringify({ message: "Password updated", id: admin.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
