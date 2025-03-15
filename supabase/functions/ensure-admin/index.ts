
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// This function ensures that there's always an admin user
// This should be invoked manually or set up as a cron job
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Default admin credentials - in production, you would want to securely store this
    const adminEmail = 'admin@example.com'
    const adminPassword = 'Admin123!'

    // Check if admin user exists
    const { data: existingUsers, error: searchError } = await supabaseAdmin.auth.admin
      .listUsers()

    if (searchError) {
      throw searchError
    }

    const adminExists = existingUsers.users.some(user => user.email === adminEmail)

    if (!adminExists) {
      // Create admin user if it doesn't exist
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin
        .createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true, // Auto-confirm email
        })

      if (createError) {
        throw createError
      }

      console.log('Admin user created:', newUser.user.id)

      // Here you could also add the user to an admin role if you have a roles system
    } else {
      console.log('Admin user already exists')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Admin account check completed' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error ensuring admin user:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to ensure admin user exists',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
