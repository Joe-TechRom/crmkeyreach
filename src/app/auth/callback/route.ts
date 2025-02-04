import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tier = requestUrl.searchParams.get('tier') || 'single_user';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
      const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code);

      if (authError) {
        console.error('Auth exchange error:', authError);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`); // Redirect to login with error
      }

      if (authData?.user) {
        try {
          // Create or update profile with initial subscription data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .upsert(
              {
                id: authData.user.id,
                user_id: authData.user.id,
                email: authData.user.email,
                subscription_status: 'pending',
                subscription_tier: tier,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'user_id',
              }
            )
            .select()
            .single();

          if (profileError) {
            console.error('Profile upsert error:', profileError);
            return NextResponse.redirect(`${requestUrl.origin}/login?error=profile_failed`); // Redirect to login with error
          }

          // Pass both userId and tier to checkout
          const checkoutUrl = new URL('/checkout', requestUrl.origin);
          checkoutUrl.searchParams.set('userId', authData.user.id);
          checkoutUrl.searchParams.set('tier', tier);

          return NextResponse.redirect(checkoutUrl.toString());
        } catch (profileUpsertError: any) {
          console.error('Profile upsert failed:', profileUpsertError);
          return NextResponse.redirect(`${requestUrl.origin}/login?error=profile_failed`); // Redirect to login with error
        }
      } else {
        console.warn('No user data returned from auth exchange.');
        return NextResponse.redirect(`${requestUrl.origin}/login?error=no_user`); // Redirect to login with error
      }
    } catch (authExchangeError: any) {
      console.error('Auth exchange failed:', authExchangeError);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`); // Redirect to login with error
    }
  }

  // Fallback to checkout with tier only
  return NextResponse.redirect(`${requestUrl.origin}/checkout?tier=${tier}`);
}
