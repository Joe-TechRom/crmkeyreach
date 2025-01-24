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

      if (error) {
        console.error('Error setting session with access token:', error);
        throw error;
      }
      userData = data.user;
    } else if (code) {
      const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Error exchanging code for session:', error);
        throw error;
      }
      userData = user;
    }

    if (!userData) {
      console.error('No user data found after authentication.');
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent('No user data found after authentication.')}`);
    }

    // Create or update profile with initial subscription data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: userData.id,
          email: userData.email,
          subscription_status: 'pending',
          subscription_tier: tier,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (profileError) {
      console.error('Error creating or updating profile:', profileError);
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent('Error creating or updating profile.')}`);
    }

    // Pass both userId and tier to checkout
    const checkoutUrl = new URL('/checkout', requestUrl.origin);
    checkoutUrl.searchParams.set('userId', userData.id);
    checkoutUrl.searchParams.set('tier', tier);

    return NextResponse.redirect(checkoutUrl.toString());
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(error.message)}`);
  }
}
