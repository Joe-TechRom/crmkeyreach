import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tier = requestUrl.searchParams.get('tier') || 'single_user';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: authData } = await supabase.auth.exchangeCodeForSession(code);
    
    if (authData?.user) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          user_id: authData.user.id,
          email: authData.user.email,
          subscription_status: 'pending',
          subscription_tier: tier,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      return NextResponse.redirect(
        `${requestUrl.origin}/checkout?session_id=${authData.user.id}&tier=${tier}`
      );
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/checkout?tier=${tier}`);
}
