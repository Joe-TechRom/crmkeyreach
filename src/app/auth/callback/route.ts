// src/app/auth/callback/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tier = requestUrl.searchParams.get('tier') || 'single_user';
  const hashParams = new URLSearchParams(requestUrl.hash?.substring(1) || '');
  const accessToken = hashParams.get('access_token');

  const supabase = createRouteHandlerClient({ cookies });

  try {
    let userData;

    if (accessToken) {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get('refresh_token') || '',
      });
      if (error) throw error;
      userData = data.user;
    } else if (code) {
      const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      userData = user;
    }

    if (userData) {
      // Create or update profile with initial subscription data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.id,
          user_id: userData.id,
          email: userData.email,
          subscription_status: 'pending',
          subscription_tier: tier,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      // Pass both userId and tier to checkout
    const checkoutUrl = new URL('/checkout', requestUrl.origin);
    checkoutUrl.searchParams.set('userId', user.id);
    checkoutUrl.searchParams.set('tier', tier);
    return NextResponse.redirect(checkoutUrl.toString());
}
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(error.message)}`);
  }

  // Fallback to checkout with tier only
  return NextResponse.redirect(`${requestUrl.origin}/checkout?tier=${tier}`);
}
