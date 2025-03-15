import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { url } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // For this example, we'll use a placeholder image service since we can't
    // actually capture screenshots in the edge function environment
    // In a real implementation, you would use a service like Puppeteer or similar
    const timestamp = new Date().getTime()
    const screenshotUrl = `https://via.placeholder.com/1200x630/333333/FFFFFF?text=Screenshot+of+${encodeURIComponent(url)}+${timestamp}`

    // In a real implementation, you would save to Supabase Storage
    /* 
    // Download the image
    const imageResponse = await fetch(screenshotUrl)
    const imageBlob = await imageResponse.blob()
    
    // Upload to Supabase Storage
    const fileName = `screenshot-${timestamp}.png`
    const { data, error } = await supabaseClient
      .storage
      .from('project-screenshots')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('project-screenshots')
      .getPublicUrl(fileName)
    */

    return new Response(
      JSON.stringify({ 
        imageUrl: screenshotUrl 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error capturing screenshot:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to capture screenshot' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
