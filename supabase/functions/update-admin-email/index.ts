import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const newEmail = 'b2csolution2436@gmail.com'
  const password = 'omharde300@shree6'

  // Check if user already exists
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const existing = users?.find(u => u.email === newEmail)
  
  if (existing) {
    // Ensure admin role
    const { data: roles } = await supabase.from('user_roles').select('*').eq('user_id', existing.id).eq('role', 'admin')
    if (!roles || roles.length === 0) {
      await supabase.from('user_roles').insert({ user_id: existing.id, role: 'admin' })
    }
    return new Response(JSON.stringify({ success: true, message: 'User exists, admin role ensured' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Create new admin user
  const { data, error } = await supabase.auth.admin.createUser({
    email: newEmail,
    password,
    email_confirm: true,
    user_metadata: { name: 'B2C Solution Admin' }
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
    })
  }

  // Add admin role (profile is created by trigger)
  await supabase.from('user_roles').insert({ user_id: data.user.id, role: 'admin' })

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
