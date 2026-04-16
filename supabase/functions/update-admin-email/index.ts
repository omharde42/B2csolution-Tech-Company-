import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Find admin user by old email
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const adminUser = users?.find(u => u.email === 'omharde300@gmail.com')
  
  if (!adminUser) {
    return new Response(JSON.stringify({ error: 'Admin user not found', users: users?.map(u => u.email) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404
    })
  }

  // Update email 
  const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
    email: 'b2csolution2436@gmail.com',
    email_confirm: true,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message, details: JSON.stringify(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
    })
  }

  // Update profile
  await supabase.from('profiles').update({ email: 'b2csolution2436@gmail.com' }).eq('id', adminUser.id)

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
